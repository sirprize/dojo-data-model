/*global define: true */

define([
    "dojo/store/Observable"
], function (
    Observable
) {
    "use strict";

    return function (s) {
        var store = Observable(s), oldQuery = store.query;
        store.query = function (query, options) {
            var result = oldQuery(query, options), oldObserve = result.observe;
            result.observe = function (listener, includeObjectUpdates) {
                var l = function (item, removedIndex, insertedIndex) {
                    item = (typeof item.deserialize === 'function') ? item : store.getModelInstance(item);
                    return listener(item, removedIndex, insertedIndex);
                };
                return oldObserve(l, includeObjectUpdates);
            };
            return result;
        };
        return store;
    };
});
