// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.FollowRequestPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.request_page,

        regions: {
            myRequests: 'div#my-requests',
            otherRequests: 'div#other-requests'
        },

        onShow: function(){
            var myRequestsCollection = new Vitalis.Models.MyFollowRequestsList();
            var otherRequestsCollection = new Vitalis.Models.OtherFollowRequestsList();

            var myRequestsEmptyView = App.Vitalis.Views.MyFollowRequestsEmptyItem;
            var otherRequestsEmptyView = App.Vitalis.Views.OtherFollowRequestsEmptyItem;

            var myRequestsView = new App.Vitalis.Views.FollowRequestsList({collection: myRequestsCollection, emptyView: myRequestsEmptyView, title: "Mis solicitudes"});
            var otherRequestsView = new App.Vitalis.Views.FollowRequestsList({collection: otherRequestsCollection, emptyView: otherRequestsEmptyView, title: "Otras solicitudes"});

            this.getRegion('myRequests').show(myRequestsView);
            this.getRegion('otherRequests').show(otherRequestsView);
        }

    });
});