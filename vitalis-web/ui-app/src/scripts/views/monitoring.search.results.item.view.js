// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.SearchMonitoringsResultsItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.monitoring_search_result_item,
        ui: {
            followButton: 'a[data-role="follow"]'
        },

        events:{
            'click @ui.followButton': 'followMonitoring'
        },

        followMonitoring: function(event){
            var monitoringId = this.model.get("id");
            var request = new Vitalis.Models.NewFollowRequest({monitoring_id: monitoringId});
            var followButton = event.target;

            request.save().then(function(){
                Materialize.toast("Solicitud enviada", 3500, '', function(){})
                $(followButton).text('Solicitud enviada');
                $(followButton).addClass('disabled');
            });
            
        }
    });
});