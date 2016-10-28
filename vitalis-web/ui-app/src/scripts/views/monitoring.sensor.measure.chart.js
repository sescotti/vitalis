// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorMeasurementChart = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.monitoring_sensor_measurement_chart,

        ui: {
            chartCanvas: 'canvas#chart',
            measurementType: 'input#measurement_type'
        },

        templateHelpers: function(){
            return {
                measurementType: this.collection.measurementType
            }
        },

        onShow: function(){

            var ctx = $(this.ui.chartCanvas);
            var measurementType = $(this.ui.measurementType).val();

            var animationOptions = this.getOption('animationOptions') || {};
            var chartAnimation = animationOptions.chart_animation !== undefined ? animationOptions.chart_animation : true;
            var labels          = [];
            var values          = [];
            var secondaryValues = [];



            this.collection.models.forEach(function(model){
                labels.unshift(new Date(model.get('measurement_date')).format('HH:MM'));
                values.unshift(model.get('value'));
                if(model.get('value_secondary')){
                    secondaryValues.unshift(model.get('value_secondary'));
                }
            });

            var datasets = [];

            datasets.push({
                borderColor: "#4bc0c0",
                data: values
            });

            if(secondaryValues.length > 0){
                datasets.push({
                    borderColor: "#9966ff",
                    data: secondaryValues
                });
            }

            var myChart = new Chart(ctx, {
                type: 'line',
                data:  {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    animation: {
                        duration: chartAnimation ? 1000 : 0
                    },
                    title: {
                        display: true,
                        text: measurementType,
                        fontColor: '#9e9e9e'
                    },
                    legend: {
                        display: false,
                        fontColor: '#9e9e9e'
                    }
                }
            });
        }

    });
});