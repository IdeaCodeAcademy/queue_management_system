from odoo import models,fields


class IcaQueueCashier(models.Model):
    _inherit = 'ica.queue.cashier'

    pharmacy_id = fields.Many2one('ica.queue.pharmacy',readonly=True)
    def action_to_pharmacy(self):
        res = super(IcaQueueCashier, self).action_to_pharmacy()
        vals = {
            "name": self.name,
        }
        self.pharmacy_id = self.env['ica.queue.pharmacy'].create(vals)
        self.pharmacy_id.action_waiting()
        return res
