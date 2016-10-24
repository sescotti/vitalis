App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Sensor = Backbone.Model.extend({
        defaults: {
            status: "disabled"
        }
    });

    Models.Sensors = Models.AbstractCollection.extend({
        model: Models.Sensor,
        url: '/api/app/home/monitorings/'
    });

    Models.AvailableSensors = Models.AbstractCollection.extend({
        model: Models.Sensor,
        url: '/api/app/sensors/'
    });
});