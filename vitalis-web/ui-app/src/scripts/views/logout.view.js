// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    var Models      = App.module('Vitalis.Models');

    Views.Logout = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.login,

        onShow: function(){

            if(localStorage.getItem('accesstoken')){
                $.ajax({
                    url: Models.API_ROOT_URL + '/api/access/logout',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accepts': 'application/json',
                        'X-Auth-Token': localStorage.getItem('accesstoken')
                    },
                    success: function(){
                        Utils.toast('Cerraste sesión correctamente');
                        localStorage.removeItem('accesstoken');
                        Urls.go('vitalis:login');
                    },
                    error: function(){
                    }
                });
            } else {
                Urls.go('vitalis:login');
            }
        }

    });
});