App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Measurement = Backbone.Model.extend({
    });

    Models.MeasurementList = Models.AbstractCollection.extend({
        model: Models.Measurement,

        url: function(){
            var monitoringId = this.monitoringId;
            var measurementType = this.measurementType;

            return '/api/app/monitorings/'+ monitoringId + '/sensors/' + measurementType;
        }
    });
});