// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorMeasurementItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_sensor_measurement_item
    });
});