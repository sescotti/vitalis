App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.FollowRequest = Models.AbstractModel.extend({});

    Models.MyFollowRequestsList = Models.AbstractCollection.extend({
        model: Models.FollowRequest,
        url: '/api/app/request/myPendingRequests'
    });

    Models.OtherFollowRequestsList = Models.AbstractCollection.extend({
        model: Models.FollowRequest,
        url: '/api/app/request/otherPendingRequests'
    });

    Models.NewFollowRequest = Models.FollowRequest.extend({
        url: "/api/app/request/"
    });
});