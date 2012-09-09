define([
    "dojo/_base/declare",
    "dojo/date/stamp",
    "dojo/json",
    "dojo-data-model/_CrudModel"
], function (
    declare,
    stamp,
    json,
    CrudModel
) {
    "use strict";

    return declare([CrudModel], {

        props: [
            'id',
            'task',
            'due'
        ],
        
        dueLoader: function (val) {
            this.set('due', stamp.fromISOString(val));
        },
        
        dueSerializer: function () {
            if (!this.get('due')) { return null; }
            return stamp.toISOString(this.get('due')).replace(/(\d{4,4}-\d{2,2}-\d{2,2}).+/, '$1');
        },
        
        dueInitializer: function () {
            this.set('due', null);
        },
        
        taskValidator: function () {
            if (!this.get('task')) {
                throw new Error('Task name required');
            }
        }
    });
});