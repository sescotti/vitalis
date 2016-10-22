// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringPatientAssignmentListView = Views.AbstractListView.extend({
        childView: App.Vitalis.Views.MonitoringPatientAssignmentItemView,

        childEvents: {
            'add:user': function (args, model) {
                $('.modal').closeModal();
                this.collection.add(model);

                this.render();
            },

            'remove:user': function (args, model) {
                $('.modal').closeModal();
                this.collection.remove(args.model);

                this.render();
            },

            'before:render': function(a, b){
                b.options.role = 'delete';
                console.log("asrasa");
            }
        }
    });
});