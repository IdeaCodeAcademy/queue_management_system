/** @odoo-module **/

import {Component,useState} from "@odoo/owl";
import {registry} from "@web/core/registry";

class ReceptionKiosk extends Component {
    setup(){
        this.state = useState({
            "counter": this.getCounter(),
        })
        console.log();
    }

    getCounter(){
        const counter = this.props.action.context.counter;
        if(counter != undefined){
            return counter;
        }else{
            // return ;
        }
    }
}

ReceptionKiosk.template = "ica_queue_reception.reception_kiosk";

registry.category('actions').add('ica.reception', ReceptionKiosk)