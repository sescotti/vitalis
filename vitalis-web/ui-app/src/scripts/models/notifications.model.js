App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Notification = Models.AbstractModel.extend({
        urlRoot: '/api/app/notifications/'
    });

    Models.NotificationsList = Models.AbstractCollection.extend({
        model: Models.Notification,
        url: '/api/app/notifications/'
    });

});