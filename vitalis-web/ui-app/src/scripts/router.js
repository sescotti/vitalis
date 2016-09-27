// router.js

'use strict';

App.module('Vitalis.Router', function (Router, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls'),
        Vitalis = App.module('Vitalis'),
        controller = {};

    controller.index = function () {
        //instanciar model
        var mainLayoutView = new App.Vitalis.Views.Main();
        App.main.show(mainLayoutView);
    };

    controller.login = function(){
        var loginView = new App.Vitalis.Views.Login({model: App.Vitalis.Login});
        App.main.show(loginView);
    }

    controller.signup = function(){
        var signupView = new App.Vitalis.Views.Signup({model: App.Vitalis.Signup});
        App.main.show(signupView);
    }

    /**
     * Vitalis.Controller
     */
    App.Vitalis.Controller = controller;

    /**
     * Vitalis.Router
     */
    var routes = {};

    function addRoute(name) {
        routes[Urls.get('vitalis:' + name)] = name;
    }
    addRoute('index');
    addRoute('login');
    addRoute('signup');

    App.Vitalis.Router = Marionette.AppRouter.extend({
        'appRoutes': routes,
        'controller': controller
    });
});