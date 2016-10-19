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
            this.model.fetch().then(function(){
                self.render();

                var sensorsCollection = new Vitalis.Models.Sensors(self.model.get('sensors'));
                var sensorsView = new App.Vitalis.Views.MonitoringSensorMeasurementList({collection: sensorsCollection});

                self.getRegion('sensors').show(sensorsView);
            });
        }

    });
});