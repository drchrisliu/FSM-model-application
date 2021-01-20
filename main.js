require.config({
    baseUrl: "javascript",
    //urlArgs: "bust=v2",
    paths: {
        d3: '../vendor/d3/d3',
        ace: '../vendor/ace',
        "dot-checker": '../vendor/graphviz-d3-renderer/dot-checker.min',
        renderer: '../vendor/graphviz-d3-renderer/renderer',
        "layout-worker": '../vendor/graphviz-d3-renderer/layout-worker',
        worker: '../vendor/ace/worker/worker',
        pouchdb: '../vendor/pouchdb/pouchdb',
        jquery: '../vendor/jquery/jquery.min',
        bootstrap: '../vendor/bootstrap/js/bootstrap',
        grapnel: '../vendor/grapnel/grapnel.min',
        config: '../config',
        ga: [
            '//www.google-analytics.com/analytics',
            'gamock'
        ]
    },
    shim: {
        jquery: {
            exports: "$"
        },
        bootstrap: {
            deps: ["jquery"],
            exports: "$.fn.popover"
        },
        "ga": {
            exports: "ga"
        }
    },
    deps: ["app"]
});
