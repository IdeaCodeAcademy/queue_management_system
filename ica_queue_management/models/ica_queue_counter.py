from odoo import fields, models


class IcaQueueCounter(models.Model):
    _name = 'ica.queue.counter'
    _description = 'IcaQueueCounter'

    name = fields.Char()
    type = fields.Selection([('reception', 'Reception'), ('cashier', 'Cashier'), ('pharmacy', 'Pharmacy')],
                            default='reception')

    def open_client_action(self):
        pass

    def _open_client_action(self, tag):
        return {
            "type": "ir.actions.client",
            "tag": tag,
            "context": {"counter": self.read(fields=['id', 'name', 'type'])[0]},
        }
