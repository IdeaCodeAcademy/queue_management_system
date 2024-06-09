from odoo import api, fields, models


class IcaQueueCounter(models.Model):
    _name = 'ica.queue.counter'
    _description = 'IcaQueueCounter'

    name = fields.Char()
    type = fields.Selection([('reception','Reception'),('cashier','Cashier'),('pharmacy','Pharmacy')], default='reception')

