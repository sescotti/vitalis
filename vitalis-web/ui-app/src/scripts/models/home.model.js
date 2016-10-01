App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Home = Backbone.Model.extend({
        url: '/api/home'
    });
});