define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/Stateful"
], function (
    declare,
    array,
    lang,
    Stateful
) {
    "use strict";

    return declare([Stateful], {
        props: [],
        
        constructor: function (args) {
            if (args.props) {
                this.props = args.props;
            }
            this.initialize();
        },

        // load data from storage (and do required transformations)
        load: function (data) {
            var loader = null;
            this.initialize();

            array.forEach(this.props, lang.hitch(this, function (name) {
                if (data[name] !== undefined) {
                    loader = this[name + 'Loader'];
                    
                    if (typeof loader === 'function') {
                        loader.apply(this, [data[name]]);
                    } else {
                        this.set(name, data[name]);
                    }
                }
            }));
        },
        
        // serialize data for starage
        serialize: function () {
            var data = {}, serializer = null;
            
            array.forEach(this.props, lang.hitch(this, function (name) {
                serializer = this[name + 'Serializer'];
                
                if (typeof serializer === 'function') {
                    data[name] = serializer.apply(this, []);
                } else {
                    data[name] = this.get(name);
                }
            }));
            
            return data;
        },

        validate: function () {
            var errors = [], ok = true, validator = null;

            array.forEach(this.props, lang.hitch(this, function (name) {
                try {
                    validator = this[name + 'Validator'];

                    if (typeof validator === 'function') {
                        validator.apply(this, []);
                    }
                } catch (e) {
                    errors[name] = e.message;
                    ok = false;
                }
            }));

            if (!ok) {
                throw {
                    errors: errors
                };
            }
        },
        
        initialize: function () {
            var initializer = null;
            
            array.forEach(this.props, lang.hitch(this, function (name) {
                initializer = this[name + 'Initializer'];
                
                if (typeof initializer === 'function') {
                    initializer.apply(this, []);
                } else {
                    this.set(name, '');
                }
            }));
        },
        
        getProps: function () {
            return this.props;
        }
    });
});