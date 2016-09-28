// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Signup = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.signup,

        ui: {
            'inputs': 'input[type=email], input[type=password]',
            'signup_button': 'input#signup',
            'return': "a#return-to-login-btn"
        },

        events: {
            'blur @ui.inputs': 'setModelData',
            'click @ui.signup_button': 'signup',
            'click @ui.return': 'returnToLogin'
        },

        signup: function(){
            console.log('username: '+ this.model.get("username") + "pass" + this.model.get("password"));
            console.log(this.model.save());
            console.log("Usuario creado");
            Urls.go("vitalis:login");
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        },

        returnToLogin: function(){
            Urls.go("vitalis:login");
        }
    });
});