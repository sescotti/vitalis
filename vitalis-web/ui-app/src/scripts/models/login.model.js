App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Login = Backbone.Model.extend({
        defaults: {
            'email': null,
            'password': null
        },
        url: '/api/access/login'
    });
});