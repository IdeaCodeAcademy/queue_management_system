from odoo import models,fields

class IcaQueueReception(models.Model):
    _name = "ica.queue.reception"
    _description = "Ica Queue Reception"

    name = fields.Char(string="Name")
    partner_id = fields.Many2one("res.partner", string="Partner")
