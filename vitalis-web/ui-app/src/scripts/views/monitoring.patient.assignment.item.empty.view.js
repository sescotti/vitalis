// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentEmptyItem = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.empty_patient_assignment_result_item,

        ui: {
            emptyCard: 'li.collection-item > div > a',
            searchUsersModal: 'div#search-users.modal'
        },

        regions: {
            searchUsersContainer: 'div#search-users-container'
        },

        events:{
            'click @ui.emptyCard': 'assignPatient'
        },

        assignPatient: function(){

            var searchUsersModal = new Vitalis.Views.UserSearchSingleSelectionModal();

            this.getRegion('searchUsersContainer').show(searchUsersModal);

            // $(this.ui.searchUsersModal).openModal();
        }
    });
});