from odoo import fields, models, _


class ResPartner(models.Model):
    _inherit = 'res.partner'

    queue_barcode = fields.Char(string='Barcode')
    cashier_ids = fields.One2many('ica.queue.cashier', 'partner_id')
    queue_count = fields.Integer(readonly=True, compute='_compute_queue_count')

    def _compute_queue_count(self):
        self.queue_count = len(self.cashier_ids)

    def open_queues(self):
        return {
            'name': _('Queues'),
            'type': 'ir.actions.act_window',
            'res_model': 'ica.queue.cashier',
            'view_mode': 'tree,kanban,form',
            'target': 'new',
            'domain': [('id', 'in', self.cashier_ids.ids)],
            'context': {'create': False}, }
