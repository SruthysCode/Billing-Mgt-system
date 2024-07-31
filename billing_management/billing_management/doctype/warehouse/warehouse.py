# Copyright (c) 2024, Sruthy and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Warehouse(Document):
	def before_save(self) :
		if self.stock<=0 :
			frappe.msgprint("Enter a valid quantity", "Error")
		
			