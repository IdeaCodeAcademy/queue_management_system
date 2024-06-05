from odoo import api, fields, models


class IcaQueueCounter(models.Model):
    _name = 'ica.queue.counter'
    _description = 'IcaQueueCounter'

    name = fields.Char()

