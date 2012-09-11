define([
    "dojo/store/Observable"
], function (
    Observable
) {
    return function (store) {
        var store = Observable(store), oldQuery = store.query;
        store.query = function (query, options) {
            var result = oldQuery(query, options), oldObserve = result.observe;
            result.observe = function (listener, includeObjectUpdates) {
                var l = function (item, removedIndex, insertedIndex) {
                    return listener(store.getModelInstance(item), removedIndex, insertedIndex);
                };
                return oldObserve(l, includeObjectUpdates);
            }
            return result;
        }
        return store;
    }
});
