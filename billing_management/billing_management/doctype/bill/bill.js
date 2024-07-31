// Copyright (c) 2024, Sruthy and contributors
// For license information, please see license.txt

let checked = 0

frappe.ui.form.on("Bill", {
    refresh(frm, cdt, cdn) {
    },
    onload: function (frm) {
        frm.set_query("product", 'items', function () {
            return {
                filters: [
                    ["Product", "stock", ">", 5]
                ]
            };
        })
    },
    multiple_items: function (frm) {
        console.log("checked", frm.doc.multiple_items)
        checked = frm.doc.multiple_items;
    },
});



frappe.ui.form.on('Purchase Items', {
    items_add: function (frm, cdt, cdn) {
        console.log("Add", checked)
        if (checked == 0) {
            productExists(frm, cdt, cdn)
        }
        else {
            let row = locals[cdt][cdn];
            console.log("ROW IS  >> ", row, row.product, row.weight)
            row.quantity = 0;
            row.amount = 0;
            // row.weight=0
            console.log("ROw.weight", row.weight, typeof (row.weight))
            if (typeof (row.weight) == number) {
                row.weight = row.weight
            }
            else {
                row.weight = 0
            }
            let tempWeight = row.weight
            row.weight = tempWeight * row.quantity
            frm.refresh_field('items');
            calculateTotal(frm)
        }
    },
    product: function (frm, cdt, cdn) {
        console.log("in product add >>")
        let row = locals[cdt][cdn];
        if (checked == 0) {
            // productExists(frm,cdt,cdn)
            let product_exist = frm.doc.items.some(item =>
                item.product === row.product && item.name !== row.name)
            if (product_exist) {
                frappe.msgprint(`The product ${row.product} is already added.`);
                frappe.model.clear_doc(cdt, cdn);
                frm.refresh_field('items');
            }
        }

        row.quantity = 0;
        // row.weight=0
        row.amount = row.price * row.quantity;
        // let tempWeight = row.weight
        // row.weight = tempWeight * row.quantity
        frm.refresh_field('items');
        calculateTotal(frm)
    },

    quantity: function (frm, cdt, cdn) {
        console.log("new row added", checked)
        let row = locals[cdt][cdn];
        console.log("ROW details >> ", row, row.product)
        if (row.quantity <= 0 || row.quantity > (row.stock - 5)) {
            frappe.msgprint(`Please enter a valid value (1 - ${row.stock - 5})`);
        }
        else {
            let tempWeight = row.weight
            row.weight = tempWeight * row.quantity
            row.amount = row.price * row.quantity;
            row.stock -= row.quantity
            updateStock(frm, row.stock, row.product)
            frm.refresh_field('items');
            calculateTotal(frm)

        }
    }
});



function updateStock(frm, newStock, product) {
    console.log("In js upd stock ")
    frappe.call({
        method: "billing_management.api.update_product_stock",
        args: {
            product_name: product,
            new_stock: newStock
        },
        callback: function (response) {
            if (response.message.status === "success") {
                frm.refresh_field('items');
                calculateTotal(frm);
            }
        }
    });
}


function calculateTotal(frm) {
    let totalAmount = 0;
    let totalWeight = 0
    for (let n of frm.doc.items) {
        console.log(n.amount, n.weight)
        if (n.weight == undefined) { n.weight = 0 }
        if (n.amount == undefined) { n.amount = 0 }
        if (n.quantity == undefined) { n.quantity = 0 }
        console.log(n.amount, n.weight)
        // totalAmount +=n.amount;
        // totalWeight +=n.weight

        totalAmount += n.quantity * n.price;
        totalWeight += n.quantity * n.weight
        console.log("line 146 ", n.quantity, n.price, n.weight, totalAmount, totalWeight)

    }
    console.log("totalAmount = ", totalAmount, totalWeight)
    frm.doc.total_amount = totalAmount
    frm.doc.total_weight = totalWeight
    frm.refresh_field('total_amount'); a
    frm.refresh_field('total_weight')
}

function productExists(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let product_exist = frm.doc.items.some(item =>
        item.product === row.product && item.name !== row.name)
    if (product_exist) {
        frappe.msgprint(`The product ${row.product} is already added.`);
        frappe.model.clear_doc(cdt, cdn);
        frm.refresh_field('items');
    }
}