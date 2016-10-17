// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSummaryItem = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_summary,
        //el: 'li.collection-item',
            //tagName: 'li',
            //className: 'collection-item avatar',
        ui: {
            'monitoringCard': 'li.collection-item'
        },

        events:{
            'click @ui.monitoringCard': 'goToMonitoring'
        },

        goToMonitoring: function(){
            var monitoringId = this.model.get("id");
            Urls.go('vitalis:patientstatus', [monitoringId]);
        },

        onShow: function(){
            console.log("asrasa");
        }

    });
});