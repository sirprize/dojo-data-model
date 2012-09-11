define([
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/promise/Promise",
    "dojo/when"
], function (
    array,
    lang,
    Deferred,
    Promise,
    when
) {
    var ModelCollection = function (results, modelCreatorCallback) {
        
        // summary:
        //      A function that wraps the results of a store query with additional
        //      methods.
        // description:
        //      QueryResults is a basic wrapper that allows for array-like iteration
        //      over any kind of returned data from a query.  While the simplest store
        //      will return a plain array of data, other stores may return deferreds or
        //      promises; this wrapper makes sure that *all* results can be treated
        //      the same.
        //
        //      Additional methods include `forEach`, `filter` and `map`.
        // results: Array|dojo/promise/Promise
        //      The result set as an array, or a promise for an array.
        // returns:
        //      An array-like object that can be used for iterating over.
        // example:
        //      Query a store and iterate over the results.
        //
        //  |   store.query({ prime: true }).forEach(function (item) {
        //  |       //  do something
        //  |   });
        
        var deferred = null,
            createModules = function (items) {
                var models = [];
                
                array.forEach(items, function (item) {
                    models[models.length] = modelCreatorCallback(item);
                });
                
                return models;
            },
            addIterativeMethod = function (results, method) {
                results[method] = function () {
                    var args = arguments;
                    return results.then(function (items) {
                        Array.prototype.unshift.call(args, createModules(items));
                        return ModelCollection(array[method].apply(array, args), modelCreatorCallback);
                    });
                };
            }
        ;

        if (!results) {
            return results;
        } else if (!results.then) {
            results = createModules(results);
        } else {
            deferred = new Deferred(); // replacement promise
            
            // intercept callbacks of promise returned by store.query()
            results.then(
                function (r) {
                    deferred.resolve(createModules(r));
                },
                function (error) {
                    deferred.reject(error);
                },
                function (update) {
                    deferred.progress(update);
                }
            );

            results = lang.delegate(new Promise(), deferred.promise); // work around frozen deferred.promise
            addIterativeMethod(results, "forEach");
            addIterativeMethod(results, "filter");
            addIterativeMethod(results, "map");
        }
        
        if (!results.total) {
            results.total = when(results, function (results) {
                return results.length;
            });
        }
        
        if (results.then && Object.freeze) {
            // don't freeze it - otherwise Observable can't add observe() method
            //Object.freeze(results);
        }

        return results;
    };
    
    return ModelCollection;
});
