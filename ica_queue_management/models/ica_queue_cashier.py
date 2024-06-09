from odoo import fields, models, _,api
from odoo.exceptions import UserError, ValidationError


class IcaQueueCashier(models.Model):
    _name = 'ica.queue.cashier'
    _description = 'IcaQueueCashier'

    name = fields.Char()
    counter_id = fields.Many2one('ica.queue.counter', string='Counter', domain="[('type','=','cashier')]")
    state = fields.Selection([
        ('draft', 'Draft'),
        ('waiting', 'Waiting'),
        ('current', 'Current'),
        ('missing', 'Missing'),
        ('to_pharmacy', 'To Pharmacy'),
        ('done', 'Done'),
    ], default='draft')

    @api.constrains('state')
    def _check_state(self):
        domain = [('counter_id', '=', self.counter_id.id), ('state', '=', 'current'),('id','!=',self.id)]
        records = self.search(domain)
        if self.state == 'current' and records:
            raise ValidationError(_("Current Queue must be unique."))

    def action_rest_to_draft(self):
        self.state = 'draft'

    def action_waiting(self):
        self.state = 'waiting'

    def action_current(self):
        self.state = 'current'

    def action_missing(self):
        self.state = 'missing'

    def action_to_pharmacy(self):
        self.state = 'to_pharmacy'

    def action_done(self):
        self.state = 'done'
