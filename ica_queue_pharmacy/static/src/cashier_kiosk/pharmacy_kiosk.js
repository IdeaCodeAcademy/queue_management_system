/** @odoo-module **/

import {registry} from "@web/core/registry";
import CashierKiosk from "@ica_queue_management/cashier_kiosk/cashier_kiosk";

class PharmacyKiosk extends CashierKiosk {
    getModel() {
        return 'ica.queue.pharmacy';
    }
}

PharmacyKiosk.template = "ica_queue_management.pharmacy_kiosk";

registry.category('actions').add('ica.pharmacy', PharmacyKiosk)