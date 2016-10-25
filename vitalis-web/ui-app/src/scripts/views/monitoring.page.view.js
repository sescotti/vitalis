// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_page,

        regions: {
            sensors: '#sensors'
        },

        initialize: function(){
            var self = this;
            this.model.fetch({success: function(){
                self.render();

                var sensors = self.model.get('sensors');

                sensors.forEach(function(sensor){
                    sensor.monitoring_id = self.model.get('id');
                });

                var sensorsCollection = new Vitalis.Models.Sensors(sensors);
                var sensorsView = new App.Vitalis.Views.MonitoringSensorList({collection: sensorsCollection});

                self.getRegion('sensors').show(sensorsView);

            }});
        }

    });
});