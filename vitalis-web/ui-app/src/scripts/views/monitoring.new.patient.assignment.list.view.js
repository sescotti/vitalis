// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentListView = Views.AbstractListView.extend({
        childView: App.Vitalis.Views.MonitoringPatientAssignmentItemView,

        ui: {
           addButton: 'a[data-role="addFollower"]'
        },

        regions: {
            searchUsersContainer: 'div#action-container'
        },

        events: {
            'click @ui.addButton': 'showAddUserModal'
        },

        childEvents: {
            'add:user': 'addUser',
            'remove:user': 'removeUser',
            'before:render': 'doBeforeRender'
        },

        addUser: function(args, model) {
            console.log('add:user@final_list_view');
            $('.modal').closeModal();
            this.collection.add(model);

            this.render();
        },

        removeUser: function(args, model) {
            $('.modal').closeModal();
            this.collection.remove(args.model);

            this.render();
        },

        doBeforeRender: function(a, b){
            b.options.role = 'delete';
        }

    });
});