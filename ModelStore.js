define([
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/promise/Promise",
    "dojo/when",
    "./ModelCollection"
],
function(
    lang,
    Deferred,
    Promise,
    when,
    ModelCollection
) {
    return function(modelClass, store) {
        
        var modelCreatorCallback = function (item) {
            var model = new modelClass({ store: store });
            model.deserialize(item);
            return model;
        };
        
        return lang.delegate(store, {
            getModelInstance: modelCreatorCallback,
            get: function (id) {
                var promiseOrValue = store.get(id),
                    deferred = null
                ;
                
                if (promiseOrValue.then) {
                    deferred = new Deferred(); // replacement promise
                    
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
                    
                    promiseOrValue = lang.delegate(new Promise(), deferred.promise); // work around frozen deferred.promise
                }
                
                return promiseOrValue;
            },
            query: function(query, directives){
                return ModelCollection(store.query(query, directives), modelCreatorCallback);
            }
        });
    };
});
