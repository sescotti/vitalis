App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Signup = Backbone.Model.extend({
        defaults: {
            'email': null,
            'password': null
        },
        url: '/api/access/signup'
    });
});