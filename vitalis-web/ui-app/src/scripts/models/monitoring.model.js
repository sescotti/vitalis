App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Monitoring = Models.AbstractModel.extend({});

    Models.MonitoringsList = Models.AbstractCollection.extend({
        model: Models.Monitoring,
        url: '/api/app/monitorings/'
    });

    Models.ModuleMonitoring = Models.AbstractModel.extend({

        url: function(){
            var moduleId = this.get('module_id');
            return '/api/app/modules/'+ moduleId + '/monitorings';
        }
    });

});