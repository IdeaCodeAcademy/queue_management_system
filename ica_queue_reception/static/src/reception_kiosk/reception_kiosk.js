/** @odoo-module **/

import {Component, onWillStart, useRef, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";

class ReceptionKiosk extends Component {
    async setup() {
        this.routerService = this.env.services.router;//useService('router');
        this.ormService = this.env.services.orm;
        this.titleService = this.env.services.title;
        this.searchInput = useRef('search-input');
        this.state = useState({
            "counter": {},
            "message": {}
        })
        onWillStart(async () => {
            await this.getCounter();
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


    async searchPartner(e) {
        if (e.keyCode === 13) {
            let inputValue = this.searchInput.el.value;
            if (inputValue) {
                let partners = await this.ormService.searchRead('res.partner', [['queue_barcode', '=', inputValue]],
                    ['id', 'name'])
                let patientId = partners[0];
                if (patientId !== undefined) {
                    var data = {
                        "counter_id": this.state.counter.id,
                        "partner_id": patientId.id
                    }
                    var newReceptionId = await this.ormService.create("ica.queue.reception", [data]);
                    await this.ormService.call(
                        "ica.queue.reception",
                        "action_confirm",
                        [newReceptionId],
                        {}
                    );
                    //
                    let receptionId = await this.ormService.searchRead('ica.queue.reception', [['id', '=', newReceptionId]],
                        ['name'])
                    let newReception = receptionId[0]
                    this.state.message = {"msg": `${newReception.name} print successfully.`, "type": "success"}
                } else {
                    this.state.message = {"msg": `Partner Not Found.`, "type": "danger"}
                }
            } else {
                this.state.message = {"msg": `Partner Not Found.`, "type": "danger"}
            }
            this.searchInput.el.value = '';
        }

    }
}

ReceptionKiosk.template = "ica_queue_reception.reception_kiosk";

registry.category('actions').add('ica.reception', ReceptionKiosk)