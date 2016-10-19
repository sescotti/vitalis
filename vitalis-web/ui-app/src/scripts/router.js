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
        var headerView = new App.Vitalis.Views.LoginHeader();

        App.header.show(headerView);
        App.main.show(loginView);
    };

    controller.signup = function(){
        var signupView = new App.Vitalis.Views.Signup({model: new Vitalis.Models.Signup()});
        var headerView = new App.Vitalis.Views.LoginHeader();

        App.header.show(headerView);
        App.main.show(signupView);
    };

    controller.home = function(){
        var homeView = new App.Vitalis.Views.Home({model: new Vitalis.Models.Home()});
        var headerView = new App.Vitalis.Views.Header({model: new Vitalis.Models.User()});

        App.header.show(headerView);
        App.main.show(homeView);

    };

    controller.monitoring = function(monitoringId){
        var monitoringPageView = new App.Vitalis.Views.MonitoringPage({model: new Vitalis.Models.PatientStatus({id: monitoringId})});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader();

        App.header.show(innerHeaderView);
        App.main.show(monitoringPageView);

    };

    controller.patients = function(){
        var patientsView = new App.Vitalis.Views.Patients();
        //var headerView = new App.Vitalis.Views.Header({model: new Vitalis.Models.User()});

        //headerView.model.fetch({beforeSend: function(xhr){
        //    xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
        //}}).then(function(a, b, c, d){
            //App.header.show(headerView);
            App.main.show(patientsView);
        //});
    };


    controller.measurements = function(monitoringId, measurementType){
        var monitoringPageView = new App.Vitalis.Views.MonitoringSensorPage({model: new Vitalis.Models.MeasurementList({monitoringId: monitoringId, measurementType: measurementType})});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader();

        App.header.show(innerHeaderView);
        App.main.show(monitoringPageView);

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
    addRoute('patients');
    addRoute('measurements');
    addRoute('monitoring');

    App.Vitalis.Router = Marionette.AppRouter.extend({
        'appRoutes': routes,
        'controller': controller
    });
});