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

            Vitalis.Models.CurentMonitoring = new Vitalis.Models.Monitoring();

            var UserList = Backbone.Collection.extend({});

            var patientsList = new UserList();
            var followersList = new UserList();

            var patientView = new Vitalis.Views.MonitoringPatientAssignmentListView({emptyView: emptyPatientItemView,
                                                                    title: "Asignar paciente",
                                                                    collection: patientsList
            });

            var followersView = new Vitalis.Views.MonitoringFollowerAssignmentListView({emptyView: emptyFollowerItemView,
                                                                    title: "Asignar seguidores",
                                                                    collection: followersList
            });

            //patientView.on('add:user', function(args){
            //    console.log('sarasaaa');
            //});
            //Vitalis.Models.CurentMonitoring.on('change:patient', function(model){
            //    var patient = model.get('patient');
            //    console.log('Usuario cambiado ' + patient.get('name'));
            //    if(patient){
            //        patientView.collection.add(patient);
            //    } else{
            //        patientView.collection.reset();
            //    }
            //});

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