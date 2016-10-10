// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    Views.LoginHeader = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.loginheader,
    });
});