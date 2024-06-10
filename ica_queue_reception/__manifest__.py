{
    "name": "Queue Reception",
    "author":"IdeaCode Academy",
    "depends": ["base","ica_queue_management"],
    "data":[
        "security/ir.model.access.csv",
        "data/sequence.xml",

        "views/ica_queue_cashier.xml",
        "views/ica_queue_reception.xml",

        "views/menus.xml",
    ],
    "assets":{
        "web.assets_backend":[
            "ica_queue_reception/static/src/**/*.js",
            "ica_queue_reception/static/src/**/*.xml",
        ]
    },

    "license": "LGPL-3",
}
