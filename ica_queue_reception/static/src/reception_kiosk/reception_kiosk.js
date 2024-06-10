/** @odoo-module **/

import {Component, useState} from "@odoo/owl";
import {registry} from "@web/core/registry";

class ReceptionKiosk extends Component {
    async setup() {
        this.routerService = this.env.services.router;//useService('router');
        this.ormService = this.env.services.orm;
        this.state = useState({
            "counter":{},
        })
         await this.getCounter();
    }

    async getCounter() {
        var counter = this.props.action.context.counter;
        let current = this.routerService.current;
        if (counter !== undefined) {
            current.search.counter_id = counter.id
        } else {
            if (current.search.counter_id) {
                let counters = await this.ormService.searchRead('ica.queue.counter',[['id','=',current.search.counter_id]],
                    ['id','name','type'])
                counter = counters[0];
            }
        }
        this.state.counter = counter;
    }
}

ReceptionKiosk.template = "ica_queue_reception.reception_kiosk";

registry.category('actions').add('ica.reception', ReceptionKiosk)