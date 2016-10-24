'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.user_search_result_item,
        //template: App.Vitalis.templates.monitoring_search_result_item,

        ui: {
            addButton: 'button[data-role="add"]',
            deleteButton: 'button[data-role="delete"]',
        },

        triggers:{
            'click @ui.addButton': 'add:user',
            'click @ui.deleteButton': 'remove:user'
        },

        templateHelpers: function(){
            var role = this.getOption('role');
            return {
                role: role
            };
        }

    });
});