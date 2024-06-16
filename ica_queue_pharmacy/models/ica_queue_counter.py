from odoo import fields, models


class IcaQueueCounter(models.Model):
    _inherit = 'ica.queue.counter'

    type = fields.Selection(selection_add=[('pharmacy', 'Pharmacy')])


    def open_client_action(self):
        if self.type == 'pharmacy':
            return self._open_client_action(tag='ica.pharmacy')
        return super(IcaQueueCounter,self).open_client_action()