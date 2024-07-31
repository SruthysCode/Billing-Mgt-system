// Copyright (c) 2024, Sruthy and contributors
// For license information, please see license.txt

let checked = 0
frappe.ui.form.on("Invoice", {
    refresh(frm) {
    },

    allow_multiple_products: function (frm) {
        checked = frm.doc.allow_multiple_products
    }

});


frappe.ui.form.on("ProductTable", {
    refresh(frm) {
    },

    products_add: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (checked == 0) {
            productExists(frm, cdt, cdn)
        }
    },
    product: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (checked == 0) {
            productExists(frm, cdt, cdn)
        }
    },
    warehouse: function (frm, cdt, cdn) {
        checkStockAvailability(frm, cdt,cdn)
    },

    quantity: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        row.amount = row.quantity * row.price
        frm.refresh_field('products')
        updateStock(row)
        calculateTotal(frm)
    }

});


function checkStockAvailability(frm, cdt,cdn) {
    let row = locals[cdt][cdn];
        
    frappe.call({
        method: "billing_management.api.check_warehouse_stock",
        args: {
            warehouse: row.warehouse,
            product: row.product
        },
        callback: function (response) {
            console.log("Response >> ", response.message.status)
            if (response.message.status == "in_stock") {
                console.log("quantity >> ")
                console.log(response.message.quantity, frm.doc.price)
                row.stock = response.message.quantity
                frm.refresh_field('products');
            }
            if (response.message.status == "out_of_stock") {
                console.log("quantity >> ")
                console.log(response.message.quantity, frm.doc.price)
                row.stock = response.message.quantity
                frm.refresh_field('products');
            }
            if (response.message.status == "error") {
                console.log("ERR >> ")
                console.log(response.message.status, response.message.message)
                frappe.msgprint("Product not in the warehouse")
                // row.stock = 0
                // frm.refresh_field('stock');
                console.log("row is >>", row)
                frappe.model.clear_doc(cdt, cdn);
                frm.refresh_field('products');
    
            }


        }
    })
}


function updateStock(row) {
    console.log("updtstck ")
    frappe.call({
        method: "billing_management.api.update_warehouse_stock",
        args: {
            warehouse: row.warehouse,
            product: row.product,
            quantity: row.quantity
        },
        callback: function (response) {
            if (response.message.status == "success") {
                frappe.msgprint("stock updated")
            }
        }
    })

}

function calculateTotal(frm) {
    totalAmount = 0
    for (let n of frm.doc.products) {
        totalAmount += n.amount
    }

    frm.doc.total_amount = totalAmount
    frm.refresh_field('total_amount')
}

function productExists(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let product_exist = frm.doc.products.some(item =>
        item.product === row.product && item.name !== row.name)
    if (product_exist) {
        frappe.msgprint(`The product ${row.product} is already added.`);
        frappe.model.clear_doc(cdt, cdn);
        frm.refresh_field('products');
    }
}