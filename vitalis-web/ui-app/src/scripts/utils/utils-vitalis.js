
'use strict';

App.module('Utils.Vitalis', function (Utils, App, Backbone, Marionette, $, _){

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
        systolic_pressure: ""
    };


    Handlebars.registerHelper('tr', function(arg){
        return translations[arg] ? translations[arg] : arg;
    });

    Handlebars.registerHelper('eq', function(arg1, arg2){
        return arg1 === arg2;
    });

    Handlebars.registerHelper('measure', function(value, measurementType){
        var unit = measures[measurementType];
        return value + " " + unit;
    });

    //var Config = App.module('Config');

     //Flag with allows to show a confirmation message while leaving the page
    //Urls._preventLeavingPage = false;
    //
    ///**
    // * Our navigation method for checkout, which always include the shopId+cartId
    // * @param {String} key The key for the url (from the `urls.json`)
    // * @param {Array} replacements The values to replace params in the url.
    // * @param {Array} options Options for the `Backbone.history.navigate` function.
    // */
    //Urls.go = function (key, replacements, options) {
    //
    //    var _options = _.extend(
    //        {'trigger': true},
    //        options
    //    );
    //
    //    Backbone.history.navigate(Urls.get(key, replacements), _options);
    //
    //};
    //
    ///**
    // * "Reloads" the current page, but using a Backbone reload, not a full-page
    // * reload, i.e. reloads the views.
    // */
    //Urls.reload = function () {
    //    Backbone.history.loadUrl(Backbone.history.fragment);
    //};
    //
    ///**
    // * Sets the variable `_preventLeavingPage` with a certain value, which
    // * is used in the `window.onbeforeunload` event to show a confirmation modal
    // * to avoid leaving the current page.
    // * @param {Boolean} isPreventing True if it should show a prompt.
    // */
    //Urls.setPreventLeavingPage = function (isPreventing) {
    //    this._preventLeavingPage = isPreventing;
    //};

});