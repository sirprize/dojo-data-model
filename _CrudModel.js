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
            this.errorModel = args.errorModel || new DataModel({ props: this.props });
        },

        getErrorModel: function () {
            return this.errorModel;
        },

        save: function (options) {
            var deferred = new Deferred(),
                errors = false,
                method = null,
                id = this.get(this.store.idProperty)
            ;
            
            this.errorModel.initialize();

            try {
                this.validate();
            } catch (e) {
                errors = e.errors;
            }

            if (errors) {
                deferred.reject(this.normalizeClientSideValidationErrors(errors));
            } else {
                method = (id === null || id === undefined || id === '') ? 'add' : 'put';
                this.promiseOrValue['save'] = this.store[method](this.serialize(), options);
                console.info('store.' + method + '()');
                
                when(
                    this.promiseOrValue['save'],
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

        normalizeClientSideValidationErrors: function (errors) {
            this.errorModel.set(errors);
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
                this.normalizeServerSideValidationErrors(error);
                return { code: 'invalid-input' };
            }
            
            return { code: 'unknown-error' };
        },
        
        normalizeServerSideValidationErrors: function (error) {
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