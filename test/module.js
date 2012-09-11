define([
    "require",
    "doh/main"
], function (require, doh) {
    if(doh.isBrowser) {
        doh.register("dojo-data-model/_CrudModel", "../../../../test/_CrudModel.html", 30000);
        doh.register("dojo-data-model/DataModel", "../../../../test/DataModel.html", 30000);
        doh.register("dojo-data-model/ModelCollection", "../../../../test/ModelCollection.html", 30000);
	}
});
