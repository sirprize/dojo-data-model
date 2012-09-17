define([
    "require",
    "doh/main"
], function (require, doh) {
    if(doh.isBrowser) {
        doh.register("dojo-data-model/_CrudModel", "../../../../test/_CrudModel.html", 30000);
        doh.register("dojo-data-model/DataModel", "../../../../test/DataModel.html", 30000);
        doh.register("dojo-data-model/ModelStore", "../../../../test/ModelStore.html", 30000);
        doh.register("dojo-data-model/QueryResults", "../../../../test/QueryResults.html", 30000);
	}
});
