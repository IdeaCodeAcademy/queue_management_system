from odoo import fields, models


class IcaQueueCounter(models.Model):
    _inherit = 'ica.queue.counter'

    def open_client_action(self):
        if self.type == 'reception':
            return self._open_client_action(tag='ica.reception')
        return super(IcaQueueCounter,self).open_client_action()