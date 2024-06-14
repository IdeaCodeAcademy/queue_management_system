from odoo import fields, models


class IcaConfirmWizard(models.TransientModel):
    _name = 'ica.confirm.wizard'
    _description = 'IcaConfirmWizard'

    counter_id = fields.Many2one('ica.queue.counter', required=True, string='Counter')

    def action_confirm(self):
        context = self.env.context
        active_model = context.get('active_model')
        active_id = context.get('active_id')

        active_record = self.env[active_model].browse(active_id)

        if active_model == 'ica.queue.cashier':
            active_record.action_pickup(counter_id=self.counter_id.id)
