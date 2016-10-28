// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.MonitoringSensorPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_sensor_page,

        regions: {
            chart: '#chart',
            values: '#values',
            alerts: '#alerts'
        },

        initialize: function(){
            this.measurementType = this.model.models[0].get('measurementType');
            this.monitoringId = this.model.models[0].get('monitoringId');
            this.retrieveData(this);
        },

        retrieveData: function(self, animationOptions){
            var measurementType = self.measurementType;
            var monitoringId = self.monitoringId;

            self.model.measurementType = measurementType;
            self.model.monitoringId = monitoringId;

            animationOptions = animationOptions ||{};

            self.model.fetch(
                {
                    success: function(){
                        self.render();
                        self.model.measurementType = measurementType;
                        self.model.monitoringId = monitoringId;

                        var chartView = new App.Vitalis.Views.MonitoringSensorMeasurementChart({collection: self.model, measurementType: measurementType, animationOptions: animationOptions});
                        var sensorsView = new App.Vitalis.Views.MonitoringSensorMeasurementList({collection: self.model});

                        self.getRegion('chart').show(chartView);
                        self.getRegion('values').show(sensorsView);

                        if(!self.keepRefreshing){
                            setTimeout(function(){
                                self.keepRefreshing = true;
                                self.activatePageRefresh(self, {chart_animation: false});
                            }, 5000);
                        }


                    }, error: function(){
                        self.keepRefreshing = false;
                        Utils.toast('¡Ups! No pudimos obtener las últimas mediciones. Intenta nuevamente más tarde');
                }});
        },

        activatePageRefresh: function(self, animationOptions){
            this.setRefreshPoller(this.retrieveData, 0, 5000, self, animationOptions);
        },

        setRefreshPoller: function(fn, timeout, interval, self, animationOptions){
                var startTime = (new Date()).getTime();
                var canPoll = true;

                interval = interval || 1000;

                (function p() {
                    //canPoll = ((new Date).getTime() - startTime ) <= timeout;
                    //if (self.keepRefreshing && canPoll)  { // ensures the function executes
                    if (self.keepRefreshing)  { // ensures the function executes
                        fn(self, animationOptions);
                        setTimeout(p, interval);
                    }
                })();
        }


    });
});