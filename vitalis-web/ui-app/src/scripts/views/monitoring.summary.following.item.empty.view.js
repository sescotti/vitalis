// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowingSummaryEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.empty_following,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'sendRequest'
        },

        registerModule: function(){
            Urls.go('vitalis:requests');
        }
    });
});