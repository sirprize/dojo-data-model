require([
    'doh',
    'dojo/Deferred',
    'dojo-data-model/DataModel',
    'dojo-data-model/QueryResults',
    'dojo/domReady!'
], function (
    doh,
    Deferred,
    DataModel,
    QueryResults
) {
    "use strict";

    var items = [{ id: 0, title: 'bla' }],
        modelCreator = function (item) {
            var model = new DataModel({});
            model.deserialize(item);
            return model;
        };

    doh.register("dojo-data-model/QueryResults tests", [
        {
            name: 'synchronous',
            runTest: function () {
                var results = QueryResults(items, modelCreator);
                doh.t(typeof results.forEach === 'function');
                doh.t(typeof results.filter === 'function');
                doh.t(typeof results.map === 'function');
            }
        },
        {
            name: 'asynchronous',
            timeout: 1000,
            runTest: function () {
                var d = new doh.Deferred(),
                    deferred = new Deferred(),
                    results = QueryResults(deferred.promise, modelCreator);

                results.then(
                    function (models) {
                        doh.t(typeof models.forEach === 'function');
                        doh.t(typeof models.filter === 'function');
                        doh.t(typeof models.map === 'function');
                        d.callback(true);
                    }
                );

                deferred.resolve(items);
                return d;
            }
        }
    ]);

    doh.run();
});