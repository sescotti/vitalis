// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.NewMonitoringPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_monitoring_page,

        regions: {
            patient: 'div#patient',
            followers: 'div#followers'
        },

        onShow: function(){
            var emptyPatientItemView = Vitalis.Views.MonitoringPatientAssignmentEmptyItem;
            var emptyFollowerItemView = Vitalis.Views.MonitoringFollowerAssignmentEmptyItem;

            var patientView = new Vitalis.Views.MonitoringPatientAssignmentListView({emptyView: emptyPatientItemView, 
                                                                    title: "Asignar paciente"});

            var followersView = new Vitalis.Views.MonitoringFollowerAssignmentListView({emptyView: emptyFollowerItemView, 
                                                                    title: "Asignar seguidores"});


            // var userSearchView = new Vitalis.Models.UserSearchResultListView({emptyView: emptyPatientItemView});
            // var monitoringsList = new Vitalis.Models.MonitoringsSearchList();
            // var searchResultsView = new App.Vitalis.Views.SearchMonitoringsResultsListView({collection: monitoringsList,
            //                                                                                 title: "Resultados de búsqueda"});

            // this.collection = monitoringsList;
            this.getRegion('patient').show(patientView);
            this.getRegion('followers').show(followersView);
        },

        search: function(e){
            var searchQuery = e.target.value;
            var self = this;
            if(searchQuery.length > 3){
                this.collection.fetch({data: $.param({query: searchQuery})});
            } else {
                this.collection.reset();
            }
        },

        resetSearch: function(){
            $(this.ui.searchField).val('');
            this.collection.reset();
        },

        onSubmit: function(e){
            e.preventDefault();
        }
    });
});