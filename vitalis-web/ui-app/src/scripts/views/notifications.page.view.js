// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.NotificationsPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.notifications_page,

        regions: {
            notifications: '#notifications'
        },

        initialize: function(){
            var self = this;
            this.collection.fetch({
                success:function(collection){

                    var notificationsListView = new Views.NotificationsListView({   collection: collection,
                                                                                    title: 'Notificaciones'
                    });

                    self.getRegion('notifications').show(notificationsListView);
            },  error: function(){
                    Utils.toast('Ups! No pudimos cargar tus notificaciones');
                }
            });
        }

    });
});