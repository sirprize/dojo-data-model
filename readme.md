# Dojo-data-model

[dojoStateful]: http://dojotoolkit.org/reference-guide/1.8/dojo/Stateful.html

Data Model For Dojo Applications

## Overview

This package contains the following components:

+ `DataModel` - stateful base class for all data models
+ `_CrudModel` - mixin for data models backed by a dojo object store
+ `ModelStore` - store wrapper with modified `get()` and `query()` to return data models instead of raw data objects
+ `ModelCollection` - like `dojo/store/util/QueryResults` but directly initializes data models
+ `Observable` - wraps `dojo/store/Observable` to work with `ModelStore`

## DataModel

`DataModel` is typically used as a base class to hold some application data and logic around that data. `DataModel` itself is based on [dojo/Stateful][dojoStateful] which provides the ability to get and set named properties, including the ability to monitor these properties for changes. `DataModel` adds `serialize()`, `deserialize(rawData)` and `validate()`.

Here's a example of a basic data model class:

    define([
        "dojo/_base/declare",
        "dojo-data-model/DataModel"
    ], function (
        declare,
        DataModel
    ) {
        return declare([DataModel], {
            props: {
                id: '',
                task: '',
                due: null
            }
        });
    });

All the model properties must be defined in `model.props` along with their initial value. `serialize()`, `deserialize()` and `validate()` will only work with properties defined in this object.

### Setting A Property

    model.set('task', 'A new task');

If no custom setter is defined on an object, performing a `set()` will result in the property value being set directly on the object. Check the [dojo/Stateful documentation][dojoStateful] for custom setters if you wish to guard against reserved property and/or method names to avoid collision.

### Setting Multiple Properties

    model.set({
        id: '',
        task: '',
        due: null
    });

### Getting A Property

    var task = model.get('task');

### Watching A Property
    
    model.watch('task', function (name, oldVal, val) {
        console.log(name + ' has changed to: ' + val);
    });

### Deserialization

When loading data from storage through an object store or some other means, the data might need to be transformed into something more meaningful to your application. For example a date might be stored as an ISO 8601 formatted string, but it would be desirable to have this value available as a `Date` object. We can define a method as follows:

    dueDeserializer: function (val) {
        this.set('due', stamp.fromISOString(val));
    }

The method name is made up by the property name followed by the string `Deserializer`. These methods will be called automatically by `deserialize()`

### Serialization

To prepare the model data for persistence, we might just as well have to perform some transformations. To follow our example above, we'll need to serialize the `Date` object to a string as expected by the persistence layer:

    dueSerializer: function () {
        if (!this.get('due')) { return null; }
        return stamp.toISOString(this.get('due'), { selector: 'date' });
    }

`serialize()` collects the data for persistence and calls all `xxxSerializer()` methods in the process, which should return the serialized value of their respective properties.

### Validation

Model validation is supported in the same fashion. For example, if the task property cannot be empty, we'll define a method to check validity and throw an exception in case of non-conformity:

    taskValidator: function () {
        if (!this.get('task')) {
            throw new Error('Input required');
        }
    }

`validate()` calls each `xxxValidator()` method and collects the exception messages. If there are any errors, validate throws itself an exception with the consolidated error messages object. It's up to the application to catch and handle this case:

    try {
        model.validate();
    } catch (e) {
        errors = e.errors;
    }

... where `e.errors` contains the error messages:

    {
        task: 'Input required'
    }

Our final model could look something like this:

    define([
        "dojo/_base/declare",
        "dojo/date/stamp",
        "dojo-data-model/DataModel"
    ], function (
        declare,
        stamp,
        DataModel
    ) {
        return declare([DataModel], {
            props: {
                id: '',
                task: '',
                due: null
            },
            
            dueDeserializer: function (val) {
                this.set('due', stamp.fromISOString(val));
            },
            
            dueSerializer: function () {
                if (!this.get('due')) { return null; }
                return stamp.toISOString(this.get('due'), { selector: 'date' });
            },
            
            taskValidator: function () {
                if (!this.get('task')) {
                    throw new Error('Input required');
                }
            }
        });
    });

## _CrudModel

`_CrudModel` is a mixin adding persistence logic to a data model by means of `save()` and `remove()`. It is mainly designed to work with models that are backed by synchronous or asynchronous object stores but the implementation is quite specific in terms of return values from a server-side API. Here's a quick spec of the assumed server-side API:

### Create An Item

    POST /api/items
    
    {
        task: "Task 1",
        due: "2012-12-21"
    }

##### Response

    Status: 201 Created
    Location: /api/items/123
    
    {
        id: "123",
        task: "Task 1",
        due: "2012-12-21"
    }

### Edit An Item

    PUT /api/items/:id
    
    {
        id: "123",
        task: "Task 1",
        due: "2012-12-21"
    }

##### Response

    Status: 200 OK
    Location: /api/items/123
    
    {
        id: "123",
        task: "Task 1",
        due: "2012-12-21"
    }

### Delete An Item

    DELETE /api/items/:id

##### Response

    Status: 204 No Content

### Error Responses

There are three different types of errors:

##### Not Found

    404 Not Found

##### Invalid JSON

    400 Bad Request

##### Invalid Fields

    422 Unprocessable Entity
    
    {
        message: 'Validation failed',
        errors: [
            {
                field: 'task',
                code: 'missing|invalid|exists'
            }
        ]
    }

Now that we know the details of the API to work with, let's get back to our previous model:

    define([
        "dojo/_base/declare",
        "dojo/_base/array",
        "dojo/date/stamp",
        "dojo-data-model/DataModel",
        "dojo-data-model/_CrudModel"
    ], function (
        declare,
        array,
        stamp,
        DataModel,
        _CrudModel
    ) {
        return declare([DataModel, _CrudModel], {
            props: {
                id: '',
                task: '',
                due: null
            },
            
            dueDeserializer: function (val) {
                this.set('due', stamp.fromISOString(val));
            },
            
            dueSerializer: function () {
                if (!this.get('due')) { return null; }
                return stamp.toISOString(this.get('due'), { selector: 'date' });
            },
            
            taskValidator: function () {
                if (!this.get('task')) {
                    throw new Error('Input required');
                }
            },
            
            normalizeServerSideValidationErrors: function (error) {
                var data = json.parse(error.response.data);
                
                array.forEach(data.errors, lang.hitch(this, function (error) {
                    if (this.props[error.field]) {
                        if (error.field === 'task') {
                            this.errorModel.set(error.field, 'Input required');
                        }
                    }
                }));
            }
        });
    });

First we've added `_CrudModel` to the dependencies array of `define` and then we added `normalizeServerSideValidationErrors()`. With this method we're taking into account potential server-side validation errors and pack them into an error data model for consumption by our views.

### Persisting A New Item

We'll assume `mylib/TodoItem` as the module id of our data model class and we'll hook it up with a `dojo/store/JsonRest` object store:

    var store = new JsonRest({
            idProperty: 'id',
            target: '/api/items'
        }),
        todoModel = new TodoItem({ store: store })
    ;
    
    todoModel.set({
        task: 'Some task',
        due: new Date(2012, 12, 21)
    });
    
    todoModel.save().then(
        function (model) {
            // created ok
        },
        function (error) {
            // handle error
        }
    );

The error is a simple object with a `code` property:

    {
        code: invalid-input | not-found | forbidden | unknown-error
    }

In case of `invalid-input`, the error details are to be found in `todoModel.getErrorModel()` which itself is an instance of `dojo-data-model/DataModel`:

    {
        task: 'Input required'
    }

### Updating An Item

    todoModel.set('task', 'A renamed task');
    
    todoModel.save().then(
        function (model) {
            // updated ok
        },
        function (error) {
            // handle error
        }
    );

### Deleting An Item

    todoModel.remove().then(
        function (model) {
            // deleted ok
        },
        function (error) {
            // handle error
        }
    );