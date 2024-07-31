// Copyright (c) 2024, Sruthy and contributors
// For license information, please see license.txt

 frappe.ui.form.on("Purchase Items", {
	product : function(frm, cdt, cdn){

        console.log("FRM >>", frm)
        console.log("CDT >> ", cdt)
        console.log("CDN ", frm.doc)
        
   }
});
