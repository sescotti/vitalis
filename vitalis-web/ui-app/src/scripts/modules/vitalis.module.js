// vitalis.module.js

'use strict';

App.module('Vitalis', function (Vitalis, App, Backbone, Marionette, $, _) {

    //var Header = App.module('Header');

    App.Events = _.extend({}, Backbone.Events);
    Vitalis.Cache = {};

    Vitalis.onStart = function() {
        new Vitalis.Router();

        startModels();
    };

    function startModels(){
    }

});