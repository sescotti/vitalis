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
            var slider      = $('#range-slider')[0];
            var sliderSecondary = $('#range-secondary-slider')[0];

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

                        slider.removeAttribute('disabled');

                        self.model.set('measurement_type', measurementType);

                        if(measurementType === 'blood_pressure'){
                            $('div#ranges-secondary').removeClass('visibility-hidden');

                        } else {
                            $('div#ranges-secondary').addClass('visibility-hidden');
                        }
                    });
                    self.getRegion('sensors').show(followingSelectView);
                }
            });


            noUiSlider.create(slider, {
                start: [50, 150],
                connect: true,
                step: 1,
                behaviour: 'drag',
                range: {
                    'min': 0,
                    'max': 200
                },
                format: wNumb({
                    decimals: 0
                })
            });

            slider.setAttribute('disabled', true);

            slider.noUiSlider.on('change', function(){
                var values = slider.noUiSlider.get();

                $("#range-from").html(values[0]);
                $("#range-to").html(values[1]);

                self.model.set("from", values[0]);
                self.model.set("to", values[1]);

            });

            noUiSlider.create(sliderSecondary,{
                start: [50, 150],
                connect: true,
                step: 1,
                behaviour: 'drag',
                range: {
                    'min': 0,
                    'max': 200
                },
                format: wNumb({
                    decimals: 0
                })
            });

            sliderSecondary.noUiSlider.on('change', function(){
                var values = sliderSecondary.noUiSlider.get();

                self.model.set("from_secondary", values[0]);
                self.model.set("to_secondary", values[1]);

                $("#range-secondary-from").html(values[0]);
                $("#range-secondary-to").html(values[1]);

            });

            if(this.model.get('measurement_type') === 'blood_pressure'){
                $('div#ranges-secondary').removeClass('visibility-hidden');
            }

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