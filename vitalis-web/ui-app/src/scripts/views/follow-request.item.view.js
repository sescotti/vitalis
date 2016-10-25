// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

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

            this.model.save({status:'accepted'}, {
                            success: function(){
                                self.destroy();

                                var requesterName = self.model.get("requested_by").name;
                                var message = "Aceptaste la solicitud de " + requesterName;
                                Utils.toast(message);
                            }
            });
        },

        rejectFollowRequest: function(){
            var self = this;

            this.model.save({status: 'rejected'}, {success: function(){

                self.destroy();

                var requesterName = self.model.get("requested_by").name;
                var message = "Rechazaste la solicitud de " + requesterName;
                Utils.toast(message);

            }});
        }

    });
});