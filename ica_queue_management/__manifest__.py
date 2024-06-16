{
    "name": "Queue Management System",
    "license": "LGPL-3",
    "depends": ["contacts"],
    "data": [
        "security/ir.model.access.csv",
        "security/queue_security.xml",

        "views/ica_queue_cashier.xml",
        "views/ica_queue_counter.xml",
        "views/res_partner.xml",

        "views/menus.xml",
        "wizard/ica_confirm_wizard.xml",

        "data/ica_queue_counter.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "ica_queue_management/static/src/**/*.js",
            "ica_queue_management/static/src/**/*.xml",
        ],
        "ica_queue_management.assets_backend":[
            "ica_queue_management/static/src/**/*.css",
        ]
    },
}
