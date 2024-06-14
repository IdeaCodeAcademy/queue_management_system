from odoo import api, fields, models

class ResPartner(models.Model):
    _inherit = 'res.partner'

    queue_barcode = fields.Char(string='Barcode')
    cashier_ids = fields.One2many('ica.queue.cashier','partner_id')

