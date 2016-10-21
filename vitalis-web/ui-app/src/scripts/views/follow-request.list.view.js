// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.FollowRequestsList = Marionette.CompositeView.extend({

        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.FollowRequestItem,

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        },

        initialize: function(){
            this.collection.fetch();
        }

    });
});