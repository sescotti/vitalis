// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls'),
        Header  = App.module('Header');


    Views.Main = Marionette.LayoutView.extend({

        className: 'ch-box',

        template: App.Vitalis.templates.main,

        ui: {
            goto_login_button: 'a#goto-login'
        },
        events:{
          'click @ui.goto_login_button': 'goToLogin'
        },
        templateHelpers: function() {
            return {
                sarasa: 'seba'
            }
        },

        onShow: function(){
            console.log('show');
        },

        goToLogin: function(){
            Urls.go('vitalis:login');
        }
    });
});