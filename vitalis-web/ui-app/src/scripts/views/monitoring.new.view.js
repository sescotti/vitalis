// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.NewMonitoringPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_monitoring_page,

        ui: {
            initMonitoringButton: 'a[data-role="init-monitoring"]'
        },

        events: {
            'click @ui.initMonitoringButton': 'initMonitoring'
        },

        regions: {
            patient: 'div#patient',
            followers: 'div#followers',
            sensors: 'div#sensors'
        },

        onShow: function(){
            var emptyPatientItemView = Vitalis.Views.MonitoringPatientAssignmentEmptyItem;
            var emptyFollowerItemView = Vitalis.Views.MonitoringFollowerAssignmentEmptyItem;

            var GenericList = Backbone.Collection.extend({});

            var patientsList = new GenericList();
            var followersList = new GenericList();
            var sensorsList = new Vitalis.Models.AvailableSensors();

            var patientView = new Vitalis.Views.MonitoringPatientAssignmentListView({
                                                                    emptyView: emptyPatientItemView,
                                                                    title: "Asignar paciente",
                                                                    collection: patientsList
            });

            var followersView = new Vitalis.Views.MonitoringFollowerAssignmentListView({
                                                                    emptyView: emptyFollowerItemView,
                                                                    title: "Asignar seguidores",
                                                                    collection: followersList,
                                                                    action: {
                                                                        icon: 'add',
                                                                        role: 'addFollower'
                                                                    }
            });

            var sensorsView = new Vitalis.Views.MonitoringSensorSelectionListView({
                title: "Asignar sensores",
                collection: sensorsList
            });

            this.model.set('patient', patientsList);
            this.model.set('followers', followersList);
            this.model.set('sensors', sensorsList);

            this.getRegion('patient').show(patientView);
            this.getRegion('followers').show(followersView);
            this.getRegion('sensors').show(sensorsView);
        },

        initMonitoring: function(event){
            this.model.save({}, { success: function(){
                Urls.go('vitalis:modules');
                var message = "Monitoreo en línea";
                Utils.toast(message, 3500, '', function(){});
            }});
        }
    });
});