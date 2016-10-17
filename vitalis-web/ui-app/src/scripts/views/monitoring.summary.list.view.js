// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSummaryList = Marionette.CompositeView.extend({

        template: App.Vitalis.templates.monitoring_summary_wrapper,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.MonitoringSummaryItem,

        onShow: function(){
            console.log("asrasa");
        }
    });
});