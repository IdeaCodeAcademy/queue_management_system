from odoo import fields, models


class IcaQueueCounter(models.Model):
    _inherit = 'ica.queue.counter'

    type = fields.Selection(selection_add=[('reception', 'Reception')],default='reception')

    def open_client_action(self):
        if self.type == 'reception':
            return self._open_client_action(tag='ica.reception')
        return super(IcaQueueCounter,self).open_client_action()