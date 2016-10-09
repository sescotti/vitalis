App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.VitalisModel = Backbone.Model.extend({

        fetch : function(options) {
            return this.constructor.__super__.fetch.apply(this, arguments);
        }

});
});