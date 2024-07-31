// Copyright (c) 2024, Sruthy and contributors
// For license information, please see license.txt

frappe.ui.form.on("ProductTable", {
	refresh(frm) {

	},

    warehouse : function(frm,cdt,cdn)
    {
        // console.log(frm, cdn, cdt)
        console.log("product", frm.doc.product)
        let row = locals[cdt][cdn];
        console.log("ROW IS  >> ", row.warehouse)
        checkStockAvailability(frm, row.warehouse, frm.doc.product)
     
    },
    quantity : function(frm)
    {
        console.log("QTY ", frm.doc.quantity, frm.doc.price)
        frm.doc.amount=  frm.doc.quantity * frm.doc.price
        frm.refresh_field('amount')
        updateStock(frm)
    }
    
});

frappe.ui.form.on("Warehouse", {

    
})

function checkStockAvailability(frm, ware_house, product_name)
{
    frappe.call({
        method : "billing_management.api.check_warehouse_stock",
        args:{
            warehouse: ware_house,
            product: product_name
        },
        callback : function(response){
            console.log("Response >> ", response.message.status)
            if(response.message.status=="in_stock")
            {
                console.log("quantity >> ")
                console.log(response.message.quantity, frm.doc.price)
                frm.doc.stock= response.message.quantity
                frm.refresh_field('stock');
            }
            if(response.message.status=="out_of_stock")
            {
                console.log("quantity >> ")
                console.log(response.message.quantity, frm.doc.price)
                frm.doc.stock= response.message.quantity
                frm.refresh_field('stock');
            }
            if(response.message.status=="error")
                {
                    console.log("ERR >> ")
                    console.log(response.message.status, response.message.message)
                    frappe.msgprint("Product not in the warehouse","Warning")
                    // frm.doc.stock= response.message.quantity
                    // frm.refresh_field('stock');
                }
               
            
        }
    })
}

function updateStock(frm)
{
    console.log("updtstck ")
    console.log(frm.doc.product,frm.doc.warehouse, frm.doc.quantity)

    frappe.call({
        method : "billing_management.api.update_warehouse_stock",
        args:{
            warehouse: frm.doc.warehouse,
            product: frm.doc.product,
            quantity : frm.doc.quantity
        },
        callback : function(response){
            console.log("Response >> ", response.message.status)
            if(response.message.status=="success")
            {
                console.log("updated >> ")
                 frappe.msgprint("stock updated")
            }
        }
    })        
   
}