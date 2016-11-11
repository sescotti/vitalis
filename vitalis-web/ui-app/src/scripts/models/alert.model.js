App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Alert = Models.AbstractModel.extend({
        urlRoot: '/api/app/alerts/'
    });

    Models.AlertList = Models.AbstractCollection.extend({
        model: Models.Alert,
        url: '/api/app/alerts/'
    });

});