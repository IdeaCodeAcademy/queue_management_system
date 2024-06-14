/** @odoo-module **/

import {Component, onWillStart, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {loadBundle} from "@web/core/assets";

export default class CashierKiosk extends Component {

    setup() {
        this.routerService = this.env.services.router;//useService('router');
        this.ormService = this.env.services.orm;
        this.titleService = this.env.services.title;
        this.busService = this.env.services.bus_service

        this.state = useState({
            'counter': {},
            'waitingQueues': [],
            'missingQueues': [],
            'currentQueue': {},
        });
        this.busService.addChannel(this.getModel());
        this.subscribeWaitingQueues();
        this.subscribePickQueue();
        this.subscribeMissingQueue();

        onWillStart(async () => {
            await loadBundle('ica_queue_management.assets_backend');
            await this.getCounter();
            await this.getWaitingQueues();
            await this.getMissingQueues();
            await this.getCurrentQueue();
        });
    }

    subscribeChannel(eventName, callback) {
        this.busService.subscribe(eventName, callback);
    }

    subscribeWaitingQueues() {
        this.subscribeChannel(`${this.getModel()}/waiting`, payload => {
            this.state.waitingQueues.push(payload);
            this.state.missingQueues = this.state.missingQueues.filter(queue=>queue.id !== payload.id);
        })
    }

    subscribePickQueue() {
        this.subscribeChannel(`${this.getModel()}/pickup`, pickUpQueue => {
            // console.log(pickUpQueue);
            this.state.waitingQueues = this.state.waitingQueues.filter(queue => queue.id !== pickUpQueue.id);
        })
    }

    subscribeMissingQueue() {
        this.subscribeChannel(`${this.getModel()}/missing`, missingQueue => {
            console.log("missing")
            console.log(missingQueue);
            this.state.missingQueues.push(missingQueue);// = this.state.waitingQueues.filter(queue=> queue.id !== pickUpQueue.id);
        })
    }

    async getCounter() {
        var counter = this.props.action.context.counter;
        let current = this.routerService.current;
        let counterId = localStorage.getItem('counterId');

        if (counter === undefined) {
            if (current.search.counter_id) {
                counterId = current.search.counter_id;
            }
            let counters = await this.ormService.searchRead('ica.queue.counter', [['id', '=', counterId]],
                ['id', 'name', 'type'])
            counter = counters[0];
        }
        current.search.counter_id = counter.id;
        localStorage.setItem('counterId', counter.id);
        this.state.counter = counter;
        this.titleService.setParts({action: counter.name})
    }

    // todo:edit model
    getModel() {
        return 'ica.queue.cashier';
    }

    async searchRead(domain) {
        return await this.ormService.searchRead(this.getModel(), domain, ['id', 'name', 'state'])
    }

    async ormCallMethod(methodName, dbId, props = {}) {
        await this.ormService.call(
            this.getModel(),
            methodName,
            [[dbId]],
            props
        );
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

    // todo:edit model


    async actionPickUp(waitingQueue) {
        // await this.ormService.call(
        //     "ica.queue.cashier",
        //     "action_pickup",
        //     [[waitingQueue.id]],
        //     {'counter_id': this.state.counter.id}
        // );
        await this.ormCallMethod('action_pickup', waitingQueue.id, {'counter_id': this.state.counter.id})
        this.state.currentQueue = waitingQueue;
        this.state.waitingQueues = this.state.waitingQueues.filter(queue => queue !== this.state.currentQueue);
    }

    async actionMissing() {
        if (!this.state.currentQueue) {
            return
        }

        await this.ormCallMethod('action_missing', this.state.currentQueue.id, {})
        // this.state.missingQueues.push(this.state.currentQueue)
        this.state.currentQueue = {}
    }

    async actionRecall(missingQueue) {
        await this.ormCallMethod('action_waiting', missingQueue.id, {})
        // this.state.waitingQueues.push(missingQueue);
        this.state.missingQueues = this.state.missingQueues.filter(queue => queue !== missingQueue);
    }

    async actionToPharmacy() {
        if (!this.state.currentQueue) {
            return
        }

        // await this.ormService.call(
        //     "ica.queue.cashier",
        //     "action_to_pharmacy",
        //     [[this.state.currentQueue.id]],
        //     {}
        // );
        await this.ormCallMethod('action_to_pharmacy', this.state.currentQueue.id, {})
        this.state.currentQueue = {}
    }

    async actionDone() {
        if (!this.state.currentQueue) {
            return
        }

        // await this.ormService.call(
        //     "ica.queue.cashier",
        //     "action_done",
        //     [[this.state.currentQueue.id]],
        //     {}
        // );
        await this.ormCallMethod('action_done', this.state.currentQueue.id, {})
        this.state.currentQueue = {}
    }
}

CashierKiosk.template = "ica_queue_management.cashier_kiosk";

registry.category('actions').add('ica.cashier', CashierKiosk)