// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorSelectionItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_sensor_selection_item,

        ui: {
          toggleSelectionButton: 'input[data-role="toggle-selection"]'
        },

        events: {
            'click @ui.toggleSelectionButton': 'toggleSelection'
        },

        toggleSelection: function(event){
            var input = event.target;
            var isChecked = $(input).is(":checked");

            var status = isChecked ? "enabled" : "disabled";
            this.model.set('status', status);
        }

    });
});