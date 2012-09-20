/*global define: true */

define([
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/promise/Promise",
    "dojo/when",
    "./QueryResults"
], function (
    lang,
    Deferred,
    Promise,
    when,
    QueryResults
) {
    "use strict";

    return function (store, ModelClass) {

        var getModelInstance = function (item) {
            var model = new ModelClass({ store: store });
            model.deserialize(item);
            return model;
        };

        return lang.delegate(store, {
            getModelInstance: getModelInstance,
            get: function () {
                var promiseOrValue = store.get.apply(store, arguments),
                    deferred = null;

                if (!promiseOrValue) {
                    return null;
                }

                if (!promiseOrValue.then) {
                    return this.getModelInstance(promiseOrValue);
                }

                deferred = new Deferred();

                // intercept callbacks of promise returned by store.get()
                promiseOrValue.then(
                    lang.hitch(this, function (r) {
                        deferred.resolve(this.getModelInstance(r));
                    }),
                    function (error) {
                        deferred.reject(error);
                    },
                    function (update) {
                        deferred.progress(update);
                    }
                );

                return lang.delegate(new Promise(), deferred.promise); // work around frozen deferred.promise
            },
            query: function () {
                return QueryResults(store.query.apply(store, arguments), getModelInstance);
            }
        });
    };
});
