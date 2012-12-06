require([
    'doh',
    'dojo/store/JsonRest',
    'dojo/store/Memory',
    'dojo-data-model/tests/MyModel',
    'dojo-data-model/ModelStore',
    'dojo/domReady!'
], function (
    doh,
    JsonRest,
    Memory,
    MyModel,
    ModelStore
) {
    "use strict";

    doh.register("dojo-data-model/ModelStore (query() tests)", [
        {
            name: 'query()',
            runTest: function () {
                var store = ModelStore(new Memory({}), MyModel),
                    results = store.query({});

                doh.t(typeof results.forEach === 'function');
                doh.t(typeof results.filter === 'function');
                doh.t(typeof results.map === 'function');
            }
        }
    ]);

    doh.register("dojo-data-model/ModelStore (get() tests)", [
        {
            name: 'synchronous',
            runTest: function () {
                var store = ModelStore(new Memory({
                        idProperty: "id",
                        data: [
                            { id: 0, task: 'Task 1', due: '2012-12-21' }
                        ]
                    }), MyModel),
                    model = store.get(0);

                doh.t(typeof model.serialize === 'function');
                doh.t(typeof model.deserialize === 'function');
                doh.t(typeof model.validate === 'function');
            }
        },
        {
            name: 'asynchronous',
            runTest: function () {
                var d = new doh.Deferred(),
                    store = ModelStore(new JsonRest({
                        idProperty: "id",
                        target: './api/default/'
                    }), MyModel),
                    promise = store.get(0);

                promise.then(
                    function (model) {
                        doh.t(model.get('task') === 'Task 1');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.run();
});