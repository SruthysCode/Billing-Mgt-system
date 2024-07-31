# Copyright (c) 2024, Sruthy and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Product(Document):
	def validate(self):
		self.validate_fields()

	def validate_fields(self):
		if self.weight_item <= 0:
			frappe.throw('Please enter a valid weight greater than 0.')

		
		if self.price <= 0:
			frappe.throw('Please enter a valid price greater than 0.')

		
		if self.stock <= 0:
			frappe.throw('Stock cannot be negative.')
