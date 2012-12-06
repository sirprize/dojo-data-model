require([
    'doh',
    'dojo/_base/array',
    'dojo/Deferred',
    'dojo-data-model/DataModel',
    'dojo-data-model/QueryResults',
    'dojo/domReady!'
], function (
    doh,
    array,
    Deferred,
    DataModel,
    QueryResults
) {
    "use strict";

    var items = [{ id: 0, title: 'bla' }],
        modelCreator = function () {
            return new DataModel({
                props: { id: '', title: '' }
            });
        };

    doh.register("dojo-data-model/QueryResults tests", [
        {
            name: 'synchronous result should have forEach() method',
            runTest: function () {
                var hasIterated = false,
                    results = QueryResults(items, modelCreator)
                ;
                
                results.forEach(function (m) {
                    hasIterated = true;
                });
                
                doh.t(hasIterated, 'forEach has iterated');
            }
        },
        {
            name: 'synchronous result should have filter() method',
            runTest: function () {
                var hasIterated = false,
                    results = QueryResults(items, modelCreator)
                ;
                
                results.filter(function (m) {
                    hasIterated = true;
                });
                
                doh.t(hasIterated, 'filter has iterated');
            }
        },
        {
            name: 'synchronous result should have map() method',
            runTest: function () {
                var hasIterated = false,
                    results = QueryResults(items, modelCreator)
                ;
                
                results.map(function (m) {
                    hasIterated = true;
                });
                
                doh.t(hasIterated, 'map has iterated');
            }
        },
        {
            name: 'asynchronous result should have forEach() method',
            timeout: 1000,
            runTest: function () {
                var d = new doh.Deferred(),
                    deferred = new Deferred(),
                    results = QueryResults(deferred.promise, modelCreator);
                
                results.forEach(function (m) {
                    d.callback(true);
                });

                deferred.resolve(items);
                return d;
            }
        },
        {
            name: 'asynchronous result should have filter() method',
            timeout: 1000,
            runTest: function () {
                var d = new doh.Deferred(),
                    deferred = new Deferred(),
                    results = QueryResults(deferred.promise, modelCreator);
                
                results.filter(function (m) {
                    d.callback(true);
                });

                deferred.resolve(items);
                return d;
            }
        },
        {
            name: 'asynchronous result should have map() method',
            timeout: 1000,
            runTest: function () {
                var d = new doh.Deferred(),
                    deferred = new Deferred(),
                    results = QueryResults(deferred.promise, modelCreator);
                
                results.map(function (m) {
                    d.callback(true);
                });

                deferred.resolve(items);
                return d;
            }
        }
    ]);

    doh.run();
});