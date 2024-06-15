{
    "name": "Ica Queue Pharmacy",
    "author": "IdeaCode Academy",
    "depends": ["ica_queue_management"],
    "data": [
        "security/ir.model.access.csv",

        "views/ica_queue_pharmacy.xml",
        "views/ica_queue_cashier.xml",

        "views/menus.xml",

        "data/ica_queue_counter.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "ica_queue_pharmacy/static/src/**/*.js",
            "ica_queue_pharmacy/static/src/**/*.xml",
        ],
    },
    "license": "LGPL-3",
}
