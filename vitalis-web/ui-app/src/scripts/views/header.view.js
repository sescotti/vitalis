// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Header = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.header,

        ui: {
             'navbarLinks': 'a[data-role="navbar-link"]'
            //'navbarLinks': 'a'
        },

        events:{
            'click @ui.navbarLinks': 'goToLink'
        },

        onShow: function(){
            $(".button-collapse").sideNav({
                closeOnClick: true
            });
        },

        goToLink: function(a){
            Urls.go(a.target.attributes["data-link"].value);
        }
    });
});