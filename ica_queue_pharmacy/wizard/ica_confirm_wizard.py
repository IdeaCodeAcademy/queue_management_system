from odoo import models


class IcaConfirmWizard(models.TransientModel):
    _inherit = 'ica.confirm.wizard'
    _description = 'IcaConfirmWizard'

    def action_confirm(self):
        context = self.env.context
        active_model = context.get('active_model')
        active_id = context.get('active_id')

        active_record = self.env[active_model].browse(active_id)

        if active_model == 'ica.queue.pharmacy':
            active_record.action_pickup(counter_id=self.counter_id.id)
