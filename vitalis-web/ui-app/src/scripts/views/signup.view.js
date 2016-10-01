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

        onShow: function () {
            $(document).ready(function () {
                Materialize.updateTextFields();
            });
        },

        signup: function(){

            if(!this.model.get("email") || !this.model.get("password") || !this.model.get("password2")){
                Materialize.toast("Completa los datos", 3500, '', function(){});
            } else if(this.model.get("password") !== this.model.get("password2")){
                Materialize.toast("Verifica que coincidan tus contraseñas", 3500, '', function(){});
            } else {
                this.model.save({timeout: 2000},
                    {
                        success: function(data){
                            $('#preloader-header').addClass('hidden');
                            Urls.go("vitalis:login");
                        },
                        error: function(model, error){
                            var message;
                            switch(error.responseJSON.error){
                                case 'internal_server_error': message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                                case 'user_already_exists': message = 'Ya hay un usuario registrado con este email'; break;
                                case 'passwords_mismatch': message = 'Verifica que coincidan tus contraseñas'; break;
                                case 'incomplete_credentials': message = 'Completa usuario y contraseña'; break;
                                default: message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                            }
                            $('#preloader-header').addClass('hidden');
                            Materialize.toast(message, 3500, '', function(){})
                        }
                    });
            }
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        },

        returnToLogin: function(){
            Urls.go("vitalis:login");
        }
    });
});