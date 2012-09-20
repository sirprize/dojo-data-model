require([
    'doh',
    'dojo/when',
    'dojo/store/Memory',
    'dojo/store/JsonRest',
    'dojo-data-model/Observable',
    'dojo-data-model/ModelStore',
    'dojo-data-model/test/MyModel',
    'dojo/domReady!'
], function (
    doh,
    when,
    Memory,
    JsonRest,
    Observable,
    ModelStore,
    MyModel
) {
    "use strict";

    doh.register("dojo-data-model/Observable", [
        {
            name: 'synchronous',
            runTest: function () {
                var d = new doh.Deferred(),
                    store = Observable(ModelStore(new Memory({}), MyModel)),
                    results = store.query({});

                results.observe(function (model, removedIndex, insertedIndex) {
                    doh.t(removedIndex === -1 && insertedIndex === 0);
                    doh.t(model.get('task') === 'Task 1');
                    d.callback(true);
                });

                store.add({
                    task: 'Task 1',
                    due: '2015-01-01'
                });

                return d;
            }
        },
        {
            name: 'asynchronous',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),
                    store = Observable(ModelStore(new JsonRest({
                        idProperty: "id",
                        target: './api/default/'
                    }), MyModel)),
                    results = store.query({}),
                    model = new MyModel({ store: store });

                results.observe(function (model, removedIndex, insertedIndex) {
                    doh.t(removedIndex === -1 && insertedIndex === 0);
                    doh.t(model.get('task') === 'Task 3');
                    d.callback(true);
                });

                model.set({
                    task: 'Task 3',
                    due: new Date('2015-01-01')
                });

                model.save();
                return d;
            }
        }
    ]);

    doh.run();
});