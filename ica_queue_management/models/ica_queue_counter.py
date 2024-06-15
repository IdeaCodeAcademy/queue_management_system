from odoo import fields, models


class IcaQueueCounter(models.Model):
    _name = 'ica.queue.counter'
    _description = 'IcaQueueCounter'
    _order="name ASC"


    name = fields.Char()
    type = fields.Selection([('cashier', 'Cashier')],default='cashier')

    def open_client_action(self):
        if self.type == 'cashier':
            return self._open_client_action(tag='ica.cashier')

    def _open_client_action(self, tag):
        return {
            "type": "ir.actions.client",
            "tag": tag,
            "context": {"counter": self.read(fields=['id', 'name', 'type'])[0]},
        }
