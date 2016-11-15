App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.MonitoringFollower = Models.AbstractModel.extend({
        idAttribute: 'monitoring_id',
        url: function(){
            var monitoringId = this.get('monitoring_id');
            return '/api/app/monitorings/' + monitoringId + "/follower";
        }
    });

});