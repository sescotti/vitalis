// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_sensor_page,

        regions: {
            chart: '#chart',
            values: '#values',
            alerts: '#alerts'
        },

        templateHelpers: function() {
            var self = this;
            return {
                measurement_type: self.model.models[0].get('measurementType')
            }
        },

        initialize: function(){
            var self = this;
            var measurementType = self.model.models[0].get('measurementType');
            this.model.fetch({success:function(){
                self.model.measurementType = measurementType;

                var chartView = new App.Vitalis.Views.MonitoringSensorMeasurementChart({collection: self.model, measurementType: measurementType});
                var sensorsView = new App.Vitalis.Views.MonitoringSensorMeasurementList({collection: self.model});

                self.getRegion('chart').show(chartView);
                self.getRegion('values').show(sensorsView);

            }});
        }
    });
});