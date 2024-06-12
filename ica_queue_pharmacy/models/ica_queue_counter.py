from odoo import fields, models


class IcaQueueCounter(models.Model):
    _inherit = 'ica.queue.counter'

    def open_client_action(self):
        if self.type == 'pharmacy':
            return self._open_client_action(tag='ica.pharmacy')
        return super(IcaQueueCounter,self).open_client_action()