// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Following = Marionette.CollectionView.extend({

        //template: App.Vitalis.templates.following,

        childView: App.Vitalis.Views.Followee,

        onShow: function(){
            console.log("asrasa");
        }
    });
});