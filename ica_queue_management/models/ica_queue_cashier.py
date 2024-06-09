from odoo import fields, models


class IcaQueueCashier(models.Model):
    _name = 'ica.queue.cashier'
    _description = 'IcaQueueCashier'

    name = fields.Char()
    counter_id = fields.Many2one('ica.queue.counter', string='Counter',domain="[('type','=','cashier')]")
    state = fields.Selection([('draft', 'Draft'), ('to_pharmacy', 'To Pharmacy')], default='draft')
