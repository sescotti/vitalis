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

        initialize: function(){
            var self = this;
            this.model.fetch().then(function(){
                self.render();

                var sensorsView = new App.Vitalis.Views.MonitoringSensorMeasurementList({collection: self.model});

                self.getRegion('values').show(sensorsView);
            });
        }

    });
});