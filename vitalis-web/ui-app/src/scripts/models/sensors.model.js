App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Sensor = Backbone.Model.extend({
    });

    Models.Sensors = Models.AbstractCollection.extend({
        model: Models.Followee,
        url: '/api/app/home/monitoring/'
    });
});