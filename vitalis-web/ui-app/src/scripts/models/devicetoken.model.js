App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.DeviceToken = Models.AbstractModel.extend({
        urlRoot: '/api/app/devicetokens/'
    });


});