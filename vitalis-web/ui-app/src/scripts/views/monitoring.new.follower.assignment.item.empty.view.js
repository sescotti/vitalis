// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowerAssignmentEmptyItem = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.empty_follower_assignment_result_item,
        ui: {
            'emptyCard': 'li.collection-item > div > a',
            searchUsersModal: 'div#search-users.modal'
        },

        regions: {
            searchUsersContainer: 'div#search-users-container'
        },

        events:{
            'click @ui.emptyCard': 'assignFollower'
        },

        assignFollower: function(){
            var searchUsersModal = new Vitalis.Views.UserSearchSingleSelectionModal();
            var self = this;
            searchUsersModal.on('add:user', function(args){
                console.log('add:user@empty_view');
                self.trigger('add:user', args.model);
            });
            this.getRegion('searchUsersContainer').show(searchUsersModal);
        }

    });
});