// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_sensor_item,
        ui: {
            'monitoringCard': 'li.collection-item'
        },

        events:{
            'click @ui.monitoringCard': 'goToMonitoring'
        },

        goToMonitoring: function(){
            var monitoringId = this.model.get("monitoring_id");
            var measurementType = this.model.get("measurement_type");

            Urls.go('vitalis:measurements', [monitoringId, measurementType]);
        },


    });
});