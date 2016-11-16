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
                //$('form.container').validate({
                //    rules: {
                //        email: {
                //            required: true,
                //            email:true
                //        },
                //        password: {
                //            required: true,
                //            minlength: 5
                //        }
                //    },
                //    messages: {
                //        email: {
                //            required: "Verifica este campo",
                //            email: "Verifica este campo"
                //        },
                //        password: {
                //            required: "Verifica este campo",
                //            minlength: "La contraseña debe tener como m&iacute;nimo 5 caracteres"
                //        }
                //    },
                //    errorElement: 'div',
                //    errorPlacement: function(error, element){
                //
                //        var message = error[0].innerHTML;
                //        var id = $(element).attr('id');
                //
                //        $(element).addClass('invalid');
                //        $('label[for='+id+']').attr('data-error', message);
                //        //var placement = $(element).data('error');
                //        //if (placement) {
                //        //    $(placement).append(error)
                //        //} else {
                //        //    error.insertAfter(element);
                //        //}
                //    }
                //});

            });
        },

        onLogin: function(){
            $('#preloader-header').removeClass('hidden');
            // FIXME: Validaciones y timeout
            $.ajax({
                url: Models.API_ROOT_URL + '/api/access/login',
                method: 'POST',
                data: JSON.stringify({
                    email: this.model.get('email'),
                    password: this.model.get('password'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accepts': 'application/json',
                    'X-Device-Token': localStorage.getItem('devicetoken')
                },
                success: function(data){
                    localStorage.setItem('accesstoken', data.token);
                    $('#preloader-header').addClass('hidden');

                    if(App.Device == "cordova") {


                        document.addEventListener("deviceready", onDeviceReady, false);
                    }

                    Urls.go("vitalis:home");
                },
                error: function(error){
                    var message = null;
                    switch(error.responseJSON.error){
                        case 'internal_server_error': message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                        case 'invalid_credentials': message = 'Usuario o contraseña incorrecto'; break;
                        case 'incomplete_credentials': message = 'Completa usuario y contraseña'; break;
                        default: message = '¡Ups! Tenemos un problema. Intenta más tarde'; break;
                    }
                    $('#preloader-header').addClass('hidden');
                    Materialize.toast(message, 3500, '', function(){})
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