define([
    "require",
    "doh/main"
], function (require, doh) {
    if(doh.isBrowser) {
        doh.register("dojo-data-model/_CrudModel", "../../../../tests/_CrudModel.html", 30000);
        doh.register("dojo-data-model/DataModel", "../../../../tests/DataModel.html", 30000);
        doh.register("dojo-data-model/ModelStore", "../../../../tests/ModelStore.html", 30000);
        doh.register("dojo-data-model/QueryResults", "../../../../tests/QueryResults.html", 30000);
	}
});
