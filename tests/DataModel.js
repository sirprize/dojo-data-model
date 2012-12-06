require([
    'doh',
    'dojo-data-model/tests/MyModel',
    'dojo/domReady!'
], function (
    doh,
    MyModel
) {
    "use strict";

    doh.register("dojo-data-model/DataModel", [
        {
            name: 'deserialize()',
            runTest: function () {
                var model = new MyModel({
                    props: { due: null }
                });

                model.deserialize({
                    due: '2012-12-21'
                });

                doh.t(typeof model.get('due') === 'object');
                doh.t(model.get('due').getFullYear() === 2012);
            }
        },
        {
            name: 'serialize()',
            runTest: function () {
                var model = new MyModel({
                    props: { due: null }
                });

                model.set('due', new Date('2012-12-21'));
                doh.t(model.serialize().due === '2012-12-21');
            }
        },
        {
            name: 'validate()',
            runTest: function () {
                var model = new MyModel({
                        props: { task: null }
                    }),
                    thrown = false;

                try {
                    model.validate();
                } catch (e) {
                    thrown = true;
                    doh.t(e.errors && e.errors.task !== '');
                }

                if (!thrown) {
                    doh.t(false);
                }
            }
        }
    ]);

    doh.run();
});