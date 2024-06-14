from odoo import fields, models, _, api
from odoo.exceptions import ValidationError


class IcaQueueCashier(models.Model):
    _name = 'ica.queue.cashier'
    _description = 'IcaQueueCashier'

    name = fields.Char(readonly=True)
    counter_id = fields.Many2one('ica.queue.counter', string='Counter', domain="[('type','=','cashier')]",
                                 readonly=True)
    state = fields.Selection([
        ('draft', 'Draft'),
        ('waiting', 'Waiting'),
        ('current', 'Current'),
        ('missing', 'Missing'),
        ('to_pharmacy', 'To Pharmacy'),  # todo:
        ('done', 'Done'),
    ], default='draft')

    start_datetime = fields.Datetime(string='Start Date', readonly=True)
    end_datetime = fields.Datetime(string='End Date', readonly=True)

    @api.constrains('state')
    def _check_state(self):
        domain = [('counter_id', '=', self.counter_id.id), ('state', '=', 'current'), ('id', '!=', self.id)]
        records = self.search(domain)
        if self.state == 'current' and records:
            raise ValidationError(_("Current Queue must be unique."))

    def action_rest_to_draft(self):
        self.state = 'draft'

    def action_waiting(self):
        self.start_datetime = fields.Datetime.now()
        self.state = 'waiting'
        self.env['bus.bus']._sendone(self._name, f'{self._name}/waiting', self.read()[0])

    def action_current(self):
        self.state = 'current'



    def action_pickup(self, counter_id):
        self.action_current();
        self.counter_id = counter_id
        self.env['bus.bus']._sendone(self._name, f'{self._name}/pickup', self.read()[0])

    def action_missing(self):
        self.state = 'missing'
        self.env['bus.bus']._sendone(self._name, f'{self._name}/missing', self.read()[0])

    def action_to_pharmacy(self):
        self.end_datetime = fields.Datetime.now()
        self.state = 'to_pharmacy'

    def action_done(self):
        self.end_datetime = fields.Datetime.now()
        self.state = 'done'

    def action_confirm_wizard(self):
        return {
            'name': _('Confirm Counter'),
            'type': 'ir.actions.act_window',
            'res_model': 'ica.confirm.wizard',
            'view_mode': 'form',
            'target': 'new',
        }