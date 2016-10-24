// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.AbstractListView = Marionette.CompositeView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        }
    });

    Views.AbstractActionableListView = Views.AbstractListView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title_and_action,

        templateHelpers: function(){
            return {
                collection_title: this.getOption('title'),
                action: this.getOption('action')
            }
        }
    });
});