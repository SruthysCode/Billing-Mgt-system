# Copyright (c) 2024, Sruthy and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

from frappe.utils import today
from frappe.utils import money_in_words

class Bill(Document):
    print(" Frpm PY >> ", Document, )
    print("BILL ####################################")

    def on_change(self) :
        print("&&&&&&&&&&&&&&CHANGE &&&&&&&&&&&&&&")

    def on_update(self) : 
          print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            
    def before_save(self):
        print("Before Save: Purchase Items", self)
        for n in self.items:
            print(n, n.product, n.price,n.quantity, type(n.quantity))
            if n.quantity<=0 :
                frappe.msgprint("Products with invalid quantity will be removed")

        self.items= [n for n in self.items if n.quantity > 0]

    def validate(self) :
        
        print("Today is  >> ",today())
        self.date = today()
        tosaveItems= [n for n in self.items if n.quantity > 0]
        totalAmount=0
        totalWeight =0
        for n in tosaveItems : 
            # print("in validate : ",n.product, n.quantity, n.price, n.weight)
            if n.quantity>0 : 
                totalAmount += n.amount
                totalWeight += n.quantity * n.weight
                # print(totalAmount, totalWeight ," < of > ", n.product)
        
        # print("Total amt >> ",self.total_amount)
        # print(" Weight >> ", self.total_weight)
        self.total_amount = totalAmount
        self.total_weight = totalWeight
        print(money_in_words(self.total_amount))
	
class PurchaseItems(Document) :
    print("from pur itm ")   
    print("PI ####################################")



    def on_change(self) :
        print("&&&&&&&&&&&&&&CHANGE &&&&&&&&&&&&&&")
        # get the stock  & update
        # updatedStock = self.stock 
        #  doc = frappe.get_doc('Product', stock)
        # doc.stock = updatedStock
        # doc.save()
        # frappe.db.commit()


    def on_update(self) : 
          print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
              

    def before_save(self):
        print("Before Save: Purchase Items")


    def validate(self):
        print("Validate: Purchase Items")

    def before_insert(self):
        print("Before Insert: Purchase Items")

    def after_insert(self):
        print("After Insert: Purchase Items")

    def before_submit(self):
        print("Before Submit: Purchase Items")

    def after_submit(self):
        print("After Submit: Purchase Items")

    def before_cancel(self):
        print("Before Cancel: Purchase Items")

    def after_cancel(self):
        print("After Cancel: Purchase Items")

    def before_delete(self):
        print("Before Delete: Purchase Items")

    def after_delete(self):
        print("After Delete: Purchase Items")

    def on_update(self):
        print("On Update: Purchase Items")
		


