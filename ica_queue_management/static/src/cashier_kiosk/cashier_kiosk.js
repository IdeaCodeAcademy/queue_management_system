/** @odoo-module **/

import {Component, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {loadBundle} from "@web/core/assets";

class CashierKiosk extends Component {

    async setup() {
        this.routerService = this.env.services.router;//useService('router');
        this.ormService = this.env.services.orm;

        this.model = 'ica.queue.cashier'
        this.modelFields = ['id', 'name', 'state']

        this.state = useState({
            'counter': {},
            'waitingQueues': [],
            'missingQueues': [],
            'currentQueue': {},
        });
        await loadBundle('ica_queue_management.assets_backend');
        await this.getCounter();
        await this.getWaitingQueues();
        await this.getMissingQueues();
        await this.getCurrentQueue();
    }

    async getCounter() {
        var counter = this.props.action.context.counter;
        let current = this.routerService.current;
        if (counter !== undefined) {
            current.search.counter_id = counter.id
        } else {
            if (current.search.counter_id) {
                let counters = await this.ormService.searchRead('ica.queue.counter', [['id', '=', current.search.counter_id]],
                    ['id', 'name', 'type'])
                counter = counters[0];
            }
        }
        this.state.counter = counter;
    }

    async getWaitingQueues() {
        this.state.waitingQueues = await this.ormService.searchRead(this.model, [['state', '=', 'waiting']], this.modelFields)
        console.log(this.state.waitingQueues)
    }

    async getMissingQueues() {
        this.state.missingQueues = await this.ormService.searchRead(this.model, [['state', '=', 'missing']], this.modelFields)

    }

    async getCurrentQueue() {
        var domain = [['state', '=', 'current'],]// ['counter_id', '=', this.state.counter.id]]
        var currentQueues = await this.ormService.searchRead(this.model, domain, this.modelFields)
        console.log(currentQueues);
        this.state.currentQueue = currentQueues[0]
    }
}

CashierKiosk.template = "ica_queue_management.cashier_kiosk";

registry.category('actions').add('ica.cashier', CashierKiosk)