from odoo import fields, models


class IcaQueueCashier(models.Model):
    _inherit = 'ica.queue.cashier'

    reception_id = fields.Many2one('ica.queue.reception', readonly=1)
