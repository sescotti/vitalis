App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Module = Models.AbstractModel.extend({
        urlRoot: '/api/app/modules/'
    });

    Models.ModulesList = Models.AbstractCollection.extend({
        model: Models.Module,
        url: '/api/app/modules/'
    });

});