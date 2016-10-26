// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringMyStatusSummaryEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.empty_mystatus,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'registerModule'
        },

        registerModule: function(){
            Urls.go('vitalis:modules');
        }
    });
});