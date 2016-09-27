// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Login = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.login,

        ui: {
            'inputs': 'input[type=text], input[type=password]',
            'login_button': 'input#login',
            'signup': 'a#signup-now-btn'

        },

        events: {
            'click @ui.login_button': 'onLogin',
            'blur @ui.inputs': 'setModelData',
            'click @ui.signup': 'signup'
        },

        onShow: function(){
            console.log('show login');
        },

        onLogin: function(){
            console.log('username: '+ this.model.get("email") + "pass" + this.model.get("password"));
            this.model.save({},
                {
                    success: function(data){
                        console.log("Usuario logueado");
                    },
                    error: function(error){
                        console.log("Usuario o contraseña incorrecto");
                    }
            });
        },

        signup: function(){
            Urls.go('vitalis:signup');
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        }
    });
});