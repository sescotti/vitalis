
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
        systolic_pressure: "Presión sistólica"
    };

    var measures = {
        temperature: "º",
        blood_pressure: "'",
        heart_rate: "bpm",
        respiratory_rate: "rpm",
        blood_oxygen: "%",
        ecg: "?",
        diastolic_pressure: "",
        systolic_pressure: "",
        height: "cm",
        weight: "kg"
    };


    Handlebars.registerHelper('tr', function(arg){
        return translations[arg] ? translations[arg] : arg;
    });

    Handlebars.registerHelper('eq', function(arg1, arg2){
        return arg1 === arg2;
    });

    Handlebars.registerHelper('or', function(arg1, arg2){
        return arg1 || arg2;
    });

    Handlebars.registerHelper('measure', function(value, measurementType){
        var unit = measures[measurementType];
        return value + unit;
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

    Handlebars.registerHelper('img_url', function(path){
        return '//localhost:3000/ui-build/images/'+path;
    });

    HandlebarsIntl.registerWith(Handlebars);

    Utils.toast = function(message, callback){
        Materialize.toast(message, 3500, '', callback);
    }

});