


import frappe
from frappe.model.document import Document

@frappe.whitelist()

def update_product_stock(product_name, new_stock):
    try:
        product = frappe.get_doc("Product", product_name)
        product.stock = int(new_stock)
        if product.stock<5 :
            print(product.stock)
            frappe.msgprint("LOW STOCK !!!")
        product.save()
        frappe.db.commit()
        # frappe.msgprint("Stock updated successfully")
        return {"status": "success", "message": (frappe._("Stock updated successfully."))}
    except Exception as e:
        print("Error in exception ", e)
        return {"status": "error", "message": str(e)}

@frappe.whitelist()
def check_warehouse_stock(warehouse, product) :
    try :
        checkStock = frappe.get_doc("Warehouse",{'warehouse_name' : warehouse, 'product_name': product})
        print("CHECK STOCK >>> ", checkStock.stock)

        exists= frappe.db.exists(
            "Warehouse",
            {  "warehouse_name": warehouse,
                'product_name': product,
            },
        )
        if not exists:
            frappe.throw("There is an active membership for warehouse")
    
        
        if checkStock.stock is None:
        # Product not in the warehouse
            return {
                "status": "not_found",
                "message": "Product not found in the specified warehouse.",
                "quantity": 0
            }
        else:
            stock_qty = checkStock.stock if checkStock.stock else 0
            if stock_qty > 0:
                # Product is in stock
                return {
                    "status": "in_stock",
                    "message": frappe._("Product is in stock."),
                    "quantity": stock_qty
                }
            else:
                # Product is out of stock
                return {
                    "status": "out_of_stock",
                    "message": frappe._("Product is out of stock."),
                    "quantity": 0
                }
            
    except Exception as e :
        print("Exception from check warehouse stck", e)
        frappe.msgprint("Product not in the warehouse", "Warning")
        return {"status": "error", "message": str(e)}   

@frappe.whitelist()
def update_warehouse_stock(warehouse, product, quantity):
     try :
        updateStock = frappe.get_doc("Warehouse",{'warehouse_name' : warehouse, 'product_name': product})

        updateStock.stock -=int(quantity)
        print("UPdated stock ~~~~~~", updateStock.stock)
        updateStock.save()
        frappe.db.commit()
        return {"status": "success", "message": (frappe._("Stock updated successfully."))}
  
     except Exception as e :
        print("Exception from update warehouse stck", e)
        return {"status": "error", "message": str(e)}     