define([
    "dojo/_base/declare",
    "dojo/date/stamp",
    "dojo-data-model/_CrudModel"
], function (
    declare,
    stamp,
    CrudModel
) {
    "use strict";

    return declare([CrudModel], {

        props: [
            'id',
            'task',
            'due'
        ],
        
        dueDeserializer: function (val) {
            this.set('due', stamp.fromISOString(val));
        },
        
        dueSerializer: function () {
            if (!this.get('due')) { return null; }
            return stamp.toISOString(this.get('due'), { selector: 'date' });
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