App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.MyStatusItem = Backbone.Model.extend({

    });

    Models.MyStatus = Models.AbstractCollection.extend({
        url: '/api/app/home/mystatus'
    });
});