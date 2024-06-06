from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class IcaQueueReception(models.Model):
    _name = "ica.queue.reception"
    _description = "Ica Queue Reception"

    name = fields.Char(string="Name", readonly=True, default=lambda x: _('New'))
    partner_id = fields.Many2one("res.partner", string="Partner",required=True)
    counter_id = fields.Many2one("ica.queue.counter", string="Counter",required=True)
    state = fields.Selection([('draft','Draft'),('confirm','Confirm')],default="draft")

    @api.model
    def create(self, values):
        if values.get('name', _('New')) == _("New"):
            values['name'] = self.env['ir.sequence'].next_by_code('ica.queue') or _("New")
        return super(IcaQueueReception, self).create(values)

    def action_confirm(self):
        self.change_state('confirm')
        # self.state = 'confirm'

    def action_draft(self):
        self.change_state('draft')

    def change_state(self,new_state):
        if self.is_allowed(new_state,self.state):
            self.state = new_state
        else:
            raise ValidationError(_('Moving from %s to %s is not allowed.') % (self.state,new_state))

    @api.model
    def is_allowed(self, new_state, old_state):
        allowed = [
            ('draft', 'confirm'),
            ('confirm', 'draft'),
        ]
        return (new_state, old_state) in allowed