# Copyright (c) 2024, Sruthy and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ProductTable(Document):
    def on_change(self) :
        print("SELF >>  ",self)
        
    def before_save(self) :
            if self.quantity<=0 :
                frappe.msgprint("Products with invalid quantity")
           

