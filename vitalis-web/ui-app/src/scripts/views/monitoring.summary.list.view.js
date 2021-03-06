// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSummaryListWithTitle = Marionette.CompositeView.extend({

        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.MonitoringSummaryItem,

        initialize: function(){
            this.collection.fetch();
        },

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        },

        onShow: function(){
            console.log("MonitoringSummaryList shown");
        }
    });
});