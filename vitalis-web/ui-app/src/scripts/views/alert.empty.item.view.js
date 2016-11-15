// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.AlertListEmptyItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.alert_list_empty_item,
        ui: {
            'emptyCard': 'li.collection-item > div > a'
        },

        events:{
            'click @ui.emptyCard': 'newAlert'
        },

        newAlert: function(){
            Urls.go('vitalis:new_alert');
        }
    });
});