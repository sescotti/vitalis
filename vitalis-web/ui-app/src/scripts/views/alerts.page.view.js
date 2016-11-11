// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.AlertsPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.alerts_page,

        ui: {
            addAlertButton: 'a[data-role="new-alert"]'
        },

        events: {
            'click @ui.addAlertButton': 'addAlert'
        },

        regions: {
            myalerts: '#myalerts'
        },

        onShow: function(){
            var emptyView       = Views.AlertListEmptyItem;
            var alertsList     = new Vitalis.Models.AlertList();
            var alertsListView = new Views.AlertListView({
                collection: alertsList,
                title: "Alertas actuales",
                emptyView: emptyView
            });

            this.getRegion('myalerts').show(alertsListView);
        },

        addAlert: function(event){
            Urls.go('vitalis:new_alert');
        }

    });
});