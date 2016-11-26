
'use strict';

App.module('Vitalis.Utils', function (Utils, App, Backbone, Marionette, $, _){

    var translations = {
        enabled: "Activo",
        disabled: "Inactivo",
        paused: "Pausado",
        temperature: "Temperatura",
        blood_pressure: "Presión arterial",
        heart_rate: "Pulso",
        respiratory_rate: "Frecuencia respiratoria",
        blood_oxygen: "Oxígeno en sangre",
        ecg: "ECG",
        diastolic_pressure: "Presión diastólica",
        systolic_pressure: "Presión sistólica",
        open: "Abierta",
        acked: "Vista",
        closed: "Cerrada"
    };

    var measures = {
        temperature: "º",
        blood_pressure: "mmHg",
        heart_rate: "bpm",
        respiratory_rate: "rpm",
        blood_oxygen: "%",
        ecg: "?",
        diastolic_pressure: "",
        systolic_pressure: "",
        height: "cm",
        weight: "kg"
    };


    var thresholds = {
        temperature: {
            value:{
                min: 30,
                max: 50
            }
        },
        blood_pressure: {
            value: {
                min: 70,
                max: 220
            },
            value_secondary: {
                min: 40,
                max: 150
            }
        },
        heart_rate: {
            value:{
                min: 10,
                max: 200
            }
        },
        respiratory_rate: {
            value:{
                min: 0,
                max: 100
            }
        },
        blood_oxygen: {
            value:{
                min: 0,
                max: 100
            }
        }
    };


    Handlebars.registerHelper('tr', function(arg){
        return translations[arg] ? translations[arg] : arg;
    });

    Handlebars.registerHelper('neq', function(arg1, arg2){
        return arg1 !== arg2;
    });

    Handlebars.registerHelper('eq', function(arg1, arg2){
        return arg1 === arg2;
    });

    Handlebars.registerHelper('or', function(arg1, arg2){
        return arg1 || arg2;
    });

    Handlebars.registerHelper('measure', function(value, measurementType){
        var unit = measures[measurementType];
        return value + " " + unit;
    });

    Handlebars.registerHelper('concat', function(args){
        //Last argument is the options object.
        //var options = arguments[arguments.length - 1];

        var joint = '';
        //Skip the last argument.
        for(var i = 0; i < arguments.length - 1; ++i) {
            joint += arguments[i];
        }

        return joint;
    });

    var basePath = $('input[type="hidden"]#x_assets_basepath').val();
    App.BASE_PATH = basePath;

    Handlebars.registerHelper('img_url', function(path){
        return 'img/'+path;
    });

    HandlebarsIntl.registerWith(Handlebars);

    Utils.toast = function(message, callback){
        Materialize.toast(message, 3500, '', callback);
    };

    Utils.threshold = function(measurementType){
        return thresholds[measurementType] || {};
    },

    (function(){
        App.Device = $('meta[name="config:device"]').attr('content');
    })();

});