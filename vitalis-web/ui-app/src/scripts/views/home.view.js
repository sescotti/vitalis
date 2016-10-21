// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Home = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.home,

        ui: {
            actionButtons: 'a[data-role="execute-action"]'
        },

        events: {
            'click @ui.actionButtons': 'executeAction'
        },

        regions: {
            myStatus: "#mystatus",
            following: "#following"
        },

        onShow: function(){
            var myStatusEmptyView = App.Vitalis.Views.MonitoringMyStatusSummaryEmptyItem;
            var followingEmptyView = App.Vitalis.Views.MonitoringFollowingSummaryEmptyItem;

            var myStatusView = new App.Vitalis.Views.MonitoringSummaryListWithTitle({collection: new Vitalis.Models.MyStatus(), emptyView: myStatusEmptyView, title: "Mi estado"});
            var followingView = new App.Vitalis.Views.MonitoringSummaryListWithTitle({collection: new Vitalis.Models.Following(), emptyView: followingEmptyView, title: "Siguiendo"});

            this.getRegion('myStatus').show(myStatusView);
            this.getRegion('following').show(followingView);

            $(document).ready(function(){
                $('.tooltipped').tooltip({delay: 50});
            });
        },

        executeAction: function(event){
            //parentElement porque siempre agarra el <i> en lugar del <a>
            var target = event.target.parentElement.getAttribute('data-target');
            Urls.go(target);
        },



    });
});