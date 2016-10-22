// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.UserSearchResultListView = Marionette.CompositeView.extend({

        template: App.Vitalis.templates.user_search_result_wrapper,
        childViewContainer: "select.icons",
        childView: App.Vitalis.Views.UserSearchResultItemView,

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        }
    });
});