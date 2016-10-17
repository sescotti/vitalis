// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Home = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.home,

        regions: {
            myStatus: "#mystatus",
            //following: "#following > ul.collection"
            following: "#following"
        },

        onShow: function(){
            var self = this;
            var myStatusView = new App.Vitalis.Views.MonitoringSummaryList({collection: new Vitalis.Models.MyStatus()});
            var followingView = new App.Vitalis.Views.MonitoringSummaryList({collection: new Vitalis.Models.Following()});


            myStatusView.collection.fetch().then(function(){
                self.getRegion('myStatus').show(myStatusView);
            });

            followingView.collection.fetch().then(function(){
                self.getRegion('following').show(followingView);
            });

        }

    });
});