// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringSensorList = Marionette.CompositeView.extend({
        template: App.Vitalis.templates.collection_wrapper,
        childViewContainer: "ul.collection",
        childView: App.Vitalis.Views.MonitoringSensorItem
    });
});