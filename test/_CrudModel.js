require([
    'doh',
    'dojo/store/Memory',
    'dojo/store/JsonRest',
    'dojo-data-model/test/MyModel',
    'dojo/domReady!'
], function (
    doh,
    Memory,
    JsonRest,
    MyModel
) {
    "use strict";

    doh.register("dojo-data-model/_CrudModel (create/save() tests)", [
        {
            name: 'Client-Side Validation',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),

                    store = new JsonRest({
                        target: null
                    }),

                    model = new MyModel({
                        store: store
                    });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'invalid-input');
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Created ok',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),

                    store = new JsonRest({
                        target: './api/default/'
                    }),

                    model = new MyModel({
                        store: store
                    }),

                    task = 'Some task';

                model.set({
                    task: task
                });

                model.save().then(
                    function (m) {
                        doh.is(m.get('task'), task);
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Invalid input',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),

                    store = new JsonRest({
                        target: './api/invalid/'
                    }),

                    model = new MyModel({
                        store: store
                    });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'invalid-input');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.register("dojo-data-model/_CrudModel (update/save() tests)", [
        {
            name: 'Client-Side Validation',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),

                    store = new JsonRest({
                        target: null
                    }),

                    model = new MyModel({
                        store: store
                    });

                model.set({
                    id: 'abc'
                });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'invalid-input');
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Updated ok',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),

                    store = new JsonRest({
                        target: './api/default/'
                    }),

                    model = new MyModel({
                        store: store
                    }),

                    task = 'Some task';

                model.set({
                    id: 0,
                    task: task
                });

                model.save().then(
                    function (m) {
                        doh.is(m.get('task'), task);
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Not found',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),

                    store = new JsonRest({
                        target: './api/not-found/'
                    }),

                    model = new MyModel({
                        store: store
                    }),

                    task = 'Some task';

                model.set({
                    id: 5,
                    task: task
                });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'not-found');
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'Invalid input',
            timeout: 3000,
            runTest: function () {
                var d = new doh.Deferred(),

                    store = new JsonRest({
                        target: './api/invalid/'
                    }),

                    model = new MyModel({
                        store: store
                    });

                model.set({
                    id: 0
                });

                model.save().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'invalid-input');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.register("dojo-data-model/_CrudModel (remove() tests)", [
        {
            name: 'remove() ok in synchronous store',
            timeout: 3000,
            runTest: function () {

                var store = new Memory({ idProperty: "id" }),
                    myModel = new MyModel({ store: store });

                myModel.deserialize({
                    task: 'Task 1',
                    due: '2012-12-21'
                });

                myModel.save();
                myModel.remove();
                doh.t(myModel.get('id') === '');
            }
        },
        {
            name: 'remove() ok in asynchronous store',
            timeout: 3000,
            runTest: function () {

                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: './api/default/'
                    }),
                    myModel = new MyModel({ store: store });

                myModel.deserialize({
                    id: 0,
                    task: 'Task 1',
                    due: '2012-12-21'
                });

                myModel.remove().then(
                    function (model) {
                        doh.t(myModel.get('id') === '');
                        d.callback(true);
                    }
                );

                return d;
            }
        },
        {
            name: 'remove() not found in asynchronous store',
            timeout: 3000,
            runTest: function () {

                var d = new doh.Deferred(),
                    store = new JsonRest({
                        target: './api/not-found/'
                    }),
                    myModel = new MyModel({ store: store });

                myModel.deserialize({
                    id: 5,
                    task: 'Task 1',
                    due: '2012-12-21'
                });

                myModel.remove().then(
                    null,
                    function (error) {
                        doh.t(error.code === 'not-found');
                        d.callback(true);
                    }
                );

                return d;
            }
        }
    ]);

    doh.run();
});