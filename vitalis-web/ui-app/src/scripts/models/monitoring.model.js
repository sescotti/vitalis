App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Monitoring = Models.AbstractModel.extend({});

    Models.MonitoringsList = Models.AbstractCollection.extend({
        model: Models.Monitoring,
        url: '/api/app/monitorings/'
    });

});