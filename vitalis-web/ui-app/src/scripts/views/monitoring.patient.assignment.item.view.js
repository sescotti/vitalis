'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.user_search_result_item,
        
        ui: {
            addButton: 'button[data-role="add"]'
        },

        events:{
            'click @ui.addButton': 'addUser'
        },

        addUser: function(event){
            var userId = this.model.get("id");

            
            var request = new Vitalis.Models.NewFollowRequest({monitoring_id: monitoringId});
            var followButton = event.target;

            request.save().then(function(){
                Materialize.toast("Solicitud enviada", 3500, '', function(){})

                var i = $(followButton).text('check');
                // $(followButton).text('Solicitud enviada');
                $(followButton).parent().prop('disabled', true);
            });
            
        }
    });
});