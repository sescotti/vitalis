// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.ModulesListView = Views.AbstractListView.extend({

        childView: App.Vitalis.Views.ModuleListItemView,
        emptyView: App.Vitalis.Views.ModuleListEmptyItem,

        initialize: function(){
            this.collection.fetch();
        },

        childEvents: {
            // This callback will be called whenever a child is rendered or emits a `render` event
            destroy: function(child) {
                //this.collection.remove(child.model);
                //child._parent.render();
            }
        }

    });
});