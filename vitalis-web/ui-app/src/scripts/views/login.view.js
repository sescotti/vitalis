// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    var Models      = App.module('Vitalis.Models');

    var ENTER_KEY = 13;

    Views.Login = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.login,

        ui: {
            'inputs': 'input[type=email], input[type=password]',
            'login_button': 'input#login',
            'signup': 'a#signup-now-btn'

        },

        events: {
            'click @ui.login_button': 'onLogin',
            'blur @ui.inputs': 'setModelData',
            'click @ui.signup': 'signup',
            'keydown': 'keyaction'
        },

        keyaction: function(e){
            if(e.which === ENTER_KEY){
                this.setModelData(e);
                this.onLogin();
            }
        },

        onShow: function(){
            console.log('show login');
            $(document).ready(function() {
                Materialize.updateTextFields();
                $('.modal').closeModal();
            });

            // Check if user is already logged in
            if(localStorage.getItem('accesstoken')){
                $.ajax({
                    url: Models.API_ROOT_URL + '/api/access/validate',
                    method: 'POST',
                    data: JSON.stringify({
                        "access_token": localStorage.getItem('accesstoken')
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accepts': 'application/json'
                    },
                    success: function(){
                        Urls.go('vitalis:home');
                    },
                    error: function(){
                    }
                });
            }
        },

        onLogin: function(){
            $('#preloader-header').removeClass('hidden');
            // FIXME: Validaciones y timeout

            var headers = {
                'Content-Type': 'application/json',
                'Accepts': 'application/json'
            };

            if(localStorage.getItem('devicetoken')){
                headers['X-Device-Token'] = localStorage.getItem('devicetoken');
            }

            $.ajax({
                url: Models.API_ROOT_URL + '/api/access/login',
                method: 'POST',
                data: JSON.stringify({
                    email: this.model.get('email'),
                    password: this.model.get('password'),
                }),
                headers: headers,
                success: function(data){
                    localStorage.setItem('accesstoken', data.token);
                    $('#preloader-header').addClass('hidden');

                    Urls.go("vitalis:home");
                },
                error: function(error){
                    var message = null;
                    if(!error.responseJSON){
                        message = 'Ups! Ocurrió un error en la conexión. Intenta nuevamente.';
                    }else{
                        switch(error.responseJSON.error){
                            case 'internal_server_error': message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                            case 'invalid_credentials': message = 'Usuario o contraseña incorrecto'; break;
                            case 'incomplete_credentials': message = 'Completa usuario y contraseña'; break;
                            default: message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                        }
                    }
                    $('#preloader-header').addClass('hidden');
                    Utils.toast(message);
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