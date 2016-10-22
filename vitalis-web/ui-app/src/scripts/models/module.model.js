App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Module = Models.AbstractModel.extend({});

    Models.ModulesList = Models.AbstractCollection.extend({
        model: Models.Module,
        url: '/api/app/modules/'
    });

});