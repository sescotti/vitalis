// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.AlertListView = Views.AbstractListView.extend({

        childView: App.Vitalis.Views.AlertListItemView,
        emptyView: App.Vitalis.Views.AlertListEmptyItem,

        initialize: function(){
            this.collection.fetch();
        },

        removeAlert: function(args, model) {
            var self = this;
            $('.modal').closeModal();
            model.model.destroy({success: function(){
                self.collection.remove(args.model);
                //self.render();
                Utils.toast("Alerta eliminada");
            }, error: function(){
                Utils.toast("Ups! No pudimos eliminar tu alerta");
            }});
        },

        childEvents: {
            'remove:alert': 'removeAlert',
            // This callback will be called whenever a child is rendered or emits a `render` event
            destroy: function(child) {
                this.collection.remove(child.model);
                //this.render();
            }
        }

    });
});