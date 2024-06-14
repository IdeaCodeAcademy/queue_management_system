from odoo import models,fields


class IcaQueuePharmacy(models.Model):
    _name = 'ica.queue.pharmacy'
    _inherit = 'ica.queue.cashier'
    _description = 'IcaQueuePharmacy'

    state = fields.Selection([
        ('draft', 'Draft'),
        ('waiting', 'Waiting'),
        ('current', 'Current'),
        ('missing', 'Missing'),
        ('done', 'Done'),
    ], default='draft')

    # name = fields.Char(readonly=True)
    # counter_id = fields.Many2one('ica.queue.counter', string='Counter',domain="[('type','=','pharmacy')]",readonly=True)
    # state = fields.Selection([
    #     ('draft','Draft'),
    #     ('waiting','Waiting'),
    #     ('current','Current'),
    #     ('missing','Missing'),
    #     ('done','done'),
    # ],default='draft')
    #
    # start_datetime = fields.Datetime(readonly=True)
    # end_datetime = fields.Datetime(readonly=True)
    #
    # def action_draft(self):
    #     self.state = 'draft'
    #
    # def action_waiting(self):
    #     self.start_datetime = fields.Datetime.now()
    #     self.state = 'waiting'
    #     self.env['bus.bus']._sendone(self._name, f'{self._name}/waiting', self.read()[0])
    #
    #
    # def action_current(self):
    #     self.state = 'current'
    #
    # def action_pickup(self,counter_id):
    #     self.action_current()
    #     self.counter_id = counter_id
    #     self.env['bus.bus']._sendone(self._name, f'{self._name}/pickup', self.read()[0])
    #
    #
    # def action_missing(self):
    #     self.state = 'missing'
    #     self.env['bus.bus']._sendone(self._name, f'{self._name}/missing', self.read()[0])
    #
    #
    # def action_done(self):
    #     self.end_datetime = fields.Datetime.now()
    #     self.state = 'done'
