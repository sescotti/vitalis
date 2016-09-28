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
        var model = new Vitalis.Models.Login();
        var loginView = new App.Vitalis.Views.Login({model: model});
        var headerView = new App.Vitalis.Views.Header();
        App.main.show(loginView);
        App.header.show(headerView);
    }

    controller.signup = function(){
        var model = new Vitalis.Models.Signup();
        var signupView = new App.Vitalis.Views.Signup({model: model});
        App.main.show(signupView);
    }

    controller.home = function(){
        var model = new Vitalis.Models.Signup();
        var homeView = new App.Vitalis.Views.Home();
        App.main.show(homeView);
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
    addRoute('home');

    App.Vitalis.Router = Marionette.AppRouter.extend({
        'appRoutes': routes,
        'controller': controller
    });
});