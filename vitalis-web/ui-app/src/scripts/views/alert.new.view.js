// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');


    Views.NewAlertPage = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.new_alert_page,

        ui: {
            registerButton: 'a[data-role="register-alert"]'
        },

        events: {
            'click @ui.registerButton': 'registerAlert'
        },

        regions: {
            patients: 'div#patients',
            sensors: 'div#sensors',
            ranges: 'div#ranges'
        },

        initialize: function(){

            $(document).ready(function() {
                $('select').material_select();
            });
        },

        onShow: function(){

            var self        = this;
            var following   = new Vitalis.Models.Following();
            var sensors     = new Vitalis.Models.AvailableSensors();

            following.fetch({
                data: $.param({'include_myself': true}),
                success: function(collection, response, options) {

                    var flattenedMonitorings = collection.models.map(function(model) {
                        return {
                            id: model.get('id'),
                            picture_url: model.get('patient').picture_url,
                            name: model.get('patient').name
                        }
                    });

                    var followingSelectView = new Views.GenericSelectView({
                        title: 'Paciente',
                        select_id: 'patients',
                        default_option: 'Selecciona un paciente',
                        items: flattenedMonitorings
                    });

                    followingSelectView.on('option:changed', function(monitoringId){
                        self.model.set('monitoring_id', monitoringId);
                    });

                    self.getRegion('patients').show(followingSelectView);
                }
            });

            sensors.fetch({
                success: function(collection, response, options) {

                    var flattenedMonitorings = collection.models.map(function(model) {
                        return {
                            id: model.get('type'),
                            picture_url: null,
                            name: model.get('type')
                        }
                    });

                    var followingSelectView = new Views.GenericSelectView({
                        title: 'Sensor',
                        select_id: 'patients',
                        default_option: 'Selecciona un sensor',
                        items: flattenedMonitorings
                    });

                    followingSelectView.on('option:changed', function(measurementType){
                        self.model.set('measurement_type', measurementType);

                        if(measurementType === 'blood_pressure'){

                        }
                    });
                    self.getRegion('sensors').show(followingSelectView);
                }
            });

            var slider = $('#range-slider')[0];
            noUiSlider.create(slider, {
                start: [20, 80],
                connect: true,
                step: 1,
                behaviour: 'drag',
                range: {
                    'min': 0,
                    'max': 100
                },
                format: wNumb({
                    decimals: 0
                })
            });

            slider.noUiSlider.on('change', function(){
                var values = slider.noUiSlider.get();

                self.model.set("from", values[0]);
                self.model.set("to", values[1]);

                $("#range-from").html(values[0]);
                $("#range-to").html(values[1]);

            });
        },

        registerAlert: function(event){
            this.model.save({}, {
                success: function(model, response, options){
                    Utils.toast('Alerta registrada');
                    Urls.go('vitalis:alerts');
                }
            })
        }

    });
});