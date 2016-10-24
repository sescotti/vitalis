App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.User = Models.AbstractModel.extend({
        defaults: {
            'email': 'invalid@email.com',
            'name': 'Local',
            'picture_url': 'https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-9/13321745_10154178340059144_6375953951169924641_n.jpg?oh=d947fda977c1f25690f6ebe18721c2c7&oe=58616839&__gda__=1483568380_2f73224ebfe735922bd2bb150593bcf5'
        },
        url: '/api/app/users/profile'
    });


    Models.UserSearchList =  Models.AbstractCollection.extend({
    	url: "/api/app/users/search",
    	model: Models.User
    });
});