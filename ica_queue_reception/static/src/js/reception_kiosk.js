/** @odoo-module **/

import {Component} from "@odoo/owl";
import {registry} from "@web/core/registry";

class ReceptionKiosk extends Component {
}

ReceptionKiosk.template = "ica_queue_reception.reception_kiosk";

registry.category('actions').add('ica.reception', ReceptionKiosk)