from odoo import models, fields, api, _


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
        self.state = 'confirm'

    def action_draft(self):
        self.state = 'draft'