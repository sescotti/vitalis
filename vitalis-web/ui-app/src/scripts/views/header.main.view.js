// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Header = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.header,

        initialize: function(){
            var self = this;
            this.model.fetch({success: function(){
                self.render();
                self.onShow();
            }});
        },

        ui: {
            navbarLinks: 'a[data-role="navbar-link"]',
            notificationsLink: 'a[data-role="notifications-link"]'

        },

        events:{
            'click @ui.navbarLinks': 'goToLink',
            'click @ui.notificationsLink': 'goToNotifications'
        },

        onShow: function(){
            $(".button-collapse").sideNav({
                closeOnClick: true
            });
        },

        goToLink: function(a){
            Urls.go(a.target.attributes["data-link"].value);
        },

        goToNotifications: function(a){
            Urls.go(a.target.parentElement.attributes["data-link"].value);
        }

    });
});