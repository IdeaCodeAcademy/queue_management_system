from odoo import api, fields, models

class ResPartner(models.Model):
    _inherit = 'res.partner'

    counter_id = fields.Many2one('ica.queue.counter')
    queue_barcode = fields.Char(string='Barcode')

