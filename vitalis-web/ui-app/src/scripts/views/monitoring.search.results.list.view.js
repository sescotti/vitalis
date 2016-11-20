// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.SearchMonitoringsResultsListView = Marionette.CompositeView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        },

        childEvents:{
            'add:user': function(args){
                console.log('add:user@search_list_view');
                this.trigger('add:user', args);
            }
        }
    });
});