// router.js

'use strict';

App.module('Vitalis.Router', function (Router, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls'),
        Vitalis = App.module('Vitalis'),
        controller = {};

    controller.index = function () {
        var mainLayoutView = new App.Vitalis.Views.Main();
        App.main.show(mainLayoutView);
    };

    controller.login = function(){
        var loginView = new App.Vitalis.Views.Login({model: new Vitalis.Models.Login()});
        App.main.show(loginView);

        resetHeader(App.Vitalis.templates.loginheader);
    }

    controller.signup = function(){
        var signupView = new App.Vitalis.Views.Signup({model: new Vitalis.Models.Signup()});
        App.main.show(signupView);


        resetHeader(App.Vitalis.templates.loginheader);
    }

    controller.home = function(){
        var homeView = new App.Vitalis.Views.Home({model: new Vitalis.Models.Home()});
        App.main.show(homeView);

        resetHeader();
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

    function resetHeader(template){

        var headerView = template ? new App.Vitalis.Views.Header({template: template}) : new App.Vitalis.Views.Header();
        App.header.show(headerView);
    }
    App.Vitalis.Router = Marionette.AppRouter.extend({
        'appRoutes': routes,
        'controller': controller
    });
});