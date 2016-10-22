// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.FollowRequestItem = Marionette.ItemView.extend({
        template: App.Vitalis.templates.follow_request_item,
        ui: {
            'monitoringCard': 'li.collection-item',
            'acceptButton': "[data-role='accept-request']",
            'rejectButton': "[data-role='reject-request']"
        },

        events:{
            'click @ui.monitoringCard': 'goToMonitoring',
            'click @ui.acceptButton': 'acceptFollowRequest',
            'click @ui.rejectButton': 'rejectFollowRequest'

        },

        onShow: function(){
            $(document).ready(function(){
                // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
                $('.modal-trigger').leanModal();
            });
        },

        acceptFollowRequest: function(){          
            var self = this;  

            this.model.save({status:'accepted'}).then(function(){
                self.destroy();

                var requesterName = self.model.get("requested_by").name;
                var patientName = self.model.get("monitoring").patient.name;
                var message = "Aceptaste la solicitud de " + requesterName + " para " + patientName;
                Materialize.toast(message, 3500, '', function(){});
            });
        },

        rejectFollowRequest: function(){
            var self = this;

            this.model.save({status: 'rejected'}).then(function(){
                self.destroy();

                var requesterName = self.model.get("requested_by").name;
                var patientName = self.model.get("monitoring").patient.name;
                var message = "Rechazaste la solicitud de " + requesterName + " para " + patientName;

                Materialize.toast(message, 3500, '', function(){});
            });
        }

    });
});