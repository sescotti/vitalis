// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.AlertListItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.alert_list_item,
        ui: {
            moreInfoButton:     "li[data-role='more-info']",
            editAlertButton:    "li[data-role='edit-alert']",
            deleteButton:       "li[data-role='delete-alert']"
        },

        events:{
            'click @ui.editAlertButton': 'editAlert'
        },

        triggers: {
            'click @ui.deleteButton': 'remove:alert'
        },

        editAlert: function(){
            var monitoringId = this.model.id;
            Urls.go('vitalis:edit_alert', [monitoringId]);
        },

        onShow: function(){
            $(document).ready(function(){
                // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
                $('.modal-trigger').leanModal();
            });
        }
    });
});