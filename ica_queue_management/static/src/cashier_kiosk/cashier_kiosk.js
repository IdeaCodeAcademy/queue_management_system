/** @odoo-module **/

import {Component, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {loadBundle} from "@web/core/assets";
import {browser} from "@web/core/browser/browser";
import {routeToUrl} from "@web/core/browser/router_service";

class CashierKiosk extends Component {

    async setup() {
        this.routerService = this.env.services.router;//useService('router');
        this.ormService = this.env.services.orm;

        // this.model = 'ica.queue.cashier'
        // this.modelFields = ['id', 'name', 'state']

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

        browser.location.href = browser.location.origin + routeToUrl(current)
        this.state.counter = counter;
    }

    async searchRead(domain) {
        return await this.ormService.searchRead('ica.queue.cashier', domain, ['id', 'name', 'state'])
    }

    async getWaitingQueues() {
        var domain = [['state', '=', 'waiting']];
        this.state.waitingQueues = await this.searchRead(domain);//await this.ormService.searchRead(this.model, [['state', '=', 'waiting']], this.modelFields)
    }

    async getMissingQueues() {
        var domain = [['state', '=', 'missing']];
        this.state.missingQueues = await this.searchRead(domain); //await this.ormService.searchRead(this.model, [['state', '=', 'missing']], this.modelFields)

    }

    async getCurrentQueue() {
        var domain = [['state', '=', 'current'], ['counter_id', '=', this.state.counter.id]]
        var currentQueues = await this.searchRead(domain); //await this.ormService.searchRead(this.model, domain, this.modelFields)
        console.log(currentQueues);
        this.state.currentQueue = currentQueues[0]
    }

    async actionPickUp(waitingQueue) {
        await this.ormService.call(
            "ica.queue.cashier",
            "action_pickup",
            [[waitingQueue.id]],
            {'counter_id': this.state.counter.id}
        );
        this.state.currentQueue = waitingQueue;
        this.state.waitingQueues = this.state.waitingQueues.filter(queue => queue !== this.state.currentQueue);
    }

    async actionMissing() {
        if (!this.state.currentQueue) {
            return
        }
        await this.ormService.call(
            "ica.queue.cashier",
            "action_missing",
            [[this.state.currentQueue.id]],
            {}
        );
        // console.log(this.state.currentQueue)
        this.state.missingQueues.push(this.state.currentQueue)
        this.state.currentQueue = {}
    }

    async actionRecall(missingQueue) {
        // console.log(missingQueue)
        await this.ormService.call(
            "ica.queue.cashier",
            "action_waiting",
            [[missingQueue.id]],
            {}
        );
        this.state.waitingQueues.push(missingQueue);
        this.state.missingQueues = this.state.missingQueues.filter(queue => queue !== missingQueue);
    }

    async actionToPharmacy() {
        if (!this.state.currentQueue) {
            return
        }

        await this.ormService.call(
            "ica.queue.cashier",
            "action_to_pharmacy",
            [[this.state.currentQueue.id]],
            {}
        );
        this.state.currentQueue = {}
    }

    async actionDone() {
        if (!this.state.currentQueue) {
            return
        }

        await this.ormService.call(
            "ica.queue.cashier",
            "action_done",
            [[this.state.currentQueue.id]],
            {}
        );
        this.state.currentQueue = {}
    }
}

CashierKiosk.template = "ica_queue_management.cashier_kiosk";

registry.category('actions').add('ica.cashier', CashierKiosk)