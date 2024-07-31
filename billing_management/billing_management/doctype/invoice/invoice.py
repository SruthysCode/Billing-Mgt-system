# Copyright (c) 2024, Sruthy and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Invoice(Document):
      
      def before_save(self) :
          for n in self.products:
              print(type(n.quantity),"type of qty")
              if n.quantity is None or int(n.quantity) <= 0:
                    frappe.msgprint("Products with invalid quantity will be removed")
          self.products= [n for n in self.products if n.quantity is not None and int(n.quantity) > 0 and n.product and n.warehouse]

