# Copyright (c) 2024, Sruthy and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class ProductTable(Document):
    def on_change(self) :
        print("SELF >>  ",self)
        
	

