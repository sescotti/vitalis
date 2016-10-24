'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowerAssignmentItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.user_search_result_item_with_delete,

        ui: {
            addButton: 'button[data-role="add"]',
            deleteButton: 'button[data-role="delete"]',
            'adminCheckbox': 'input[data-role="admin"]'
        },

        events: {
            'click @ui.adminCheckbox': 'updateAdmin'
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
        },

        updateAdmin: function(event){
            var input = event.target;
            var isChecked = $(input).is(":checked");
            this.model.set('is_admin', isChecked);
        }

    });
});