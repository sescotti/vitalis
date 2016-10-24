App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Measurement = Backbone.Model.extend({
    });

    Models.MeasurementList = Models.AbstractCollection.extend({
        model: Models.Measurement,

        url: function(){
            var monitoringId = this.models[0].get('monitoringId');
            var measurementType = this.models[0].get('measurementType');

            return '/api/app/monitorings/'+ monitoringId + '/sensors/' + measurementType;
        }
    });
});