define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/when",
    "./DataModel"
], function (
    declare,
    array,
    lang,
    Deferred,
    when,
    DataModel
) {
    "use strict";

    return declare([DataModel], {

        store: null,
        errorModel: null,
        promiseOrValue: [],

        constructor: function (args) {
            this.store = args.store;
            this.errorModel = new DataModel({ props: this.props });
        },

        getErrorModel: function () {
            return this.errorModel;
        },

        fetch: function (id) {
            var deferred = new Deferred();
            this.promiseOrValue['fetch'] = this.store.get(id);
            
            when(
                this.promiseOrValue['fetch'],
                lang.hitch(this, function (todo) {
                    if (todo) {
                        this.load(todo);
                        deferred.resolve(this);
                    } else {
                        deferred.reject(this.normalizeSynchronousNotFound());
                    }
                }),
                lang.hitch(this, function (error) {
                    deferred.reject(this.normalizeServerError(error));
                })
            );
            
            return deferred.promise;
        },

        create: function () {
            var deferred = new Deferred(), errors = false;
            this.errorModel.initialize();

            try {
                this.validate();
            } catch (e) {
                errors = e.errors;
            }

            if (errors) {
                deferred.reject(this.normalizeClientSideValidationErrors(errors));
            } else {
                this.promiseOrValue['add'] = this.store.add(this.serialize());
                
                when(
                    this.promiseOrValue['add'],
                    lang.hitch(this, function (id) {
                        this.set(this.store.idProperty, id);
                        deferred.resolve(this);
                    }),
                    lang.hitch(this, function (error) {
                        deferred.reject(this.normalizeServerError(error));
                    })
                );
            }
            
            return deferred.promise;
        },
        
        update: function () {
            var deferred = new Deferred(), errors = false;
            this.errorModel.initialize();

            try {
                this.validate();
            } catch (e) {
                errors = e.errors;
            }

            if (errors) {
                deferred.reject(this.normalizeClientSideValidationErrors(errors));
            } else {
                this.promiseOrValue['put'] = this.store.put(this.serialize());
                
                when(
                    this.promiseOrValue['put'],
                    lang.hitch(this, function (id) {
                        deferred.resolve(this);
                    }),
                    lang.hitch(this, function (error) {
                        deferred.reject(this.normalizeServerError(error));
                    })
                );
            }
            
            return deferred.promise;
        },
        
        normalizeSynchronousNotFound: function () {
            return { code: 'not-found' };
        },
        
        normalizeClientSideValidationErrors: function (errors) {
            this.errorModel.load(errors);
            return { code: 'invalid-input' };
        },
        
        normalizeServerError: function (error) {
            if (!error.response) {
                return { code: 'unknown-error' };
            }
            
            if (error.response.status === 400) {
                return { code: 'unknown-error' };
            }
            
            if (error.response.status === 403) {
                return { code: 'forbidden' };
            }
            
            if (error.response.status === 404) {
                return { code: 'not-found' };
            }
            
            if (error.response.status === 422) {
                this.loadServerSideValidationErrors(error);
                return { code: 'invalid-input' };
            }
            
            return { code: 'unknown-error' };
        },
        
        loadServerSideValidationErrors: function (error) {
            // stub
        },
        
        destroy: function () {
            array.forEach(this.promisOrValue, function (promiseOrValue) {
                if (promiseOrValue.cancel) {
                    promiseOrValue.cancel();
                }
            });
        }
    });
});