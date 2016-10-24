// router.js

'use strict';

App.module('Vitalis.Router', function (Router, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls'),
        Vitalis = App.module('Vitalis'),
        Utils   = App.module('Vitalis.Utils'),
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
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({
            title: "Ver monitoreo",
            menu: {
                options: [
                    {
                        id: 'finish_monitoring',
                        label: "Finalizar monitoreo",
                        action: function(event, container){
                            var monitoring = new Vitalis.Models.Monitoring({id: monitoringId});

                            monitoring.destroy().then(function(){
                                Utils.toast("Monitoreo finalizado");
                                Urls.go('vitalis:home');
                            });
                        }
                    }
                ]

            }
        });

        App.header.show(innerHeaderView);
        App.main.show(monitoringPageView);

    };

    controller.patients = function(){
        var patientsView = new App.Vitalis.Views.Patients();
        App.main.show(patientsView);
    };


    controller.measurements = function(monitoringId, measurementType){
        var monitoringPageView = new App.Vitalis.Views.MonitoringSensorPage({model: new Vitalis.Models.MeasurementList({monitoringId: monitoringId, measurementType: measurementType})});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Ver mediciones"});

        App.header.show(innerHeaderView);
        App.main.show(monitoringPageView);
    };

    controller.requests = function(){
        var followRequestPage = new App.Vitalis.Views.FollowRequestPage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({   title: "Mis solicitudes",
                                                                    secondary_action: {
                                                                        icon: 'person_add',
                                                                        action: function(event){
                                                                            Urls.go('vitalis:new_request');
                                                                        }
                                                                }});

        App.header.show(innerHeaderView);
        App.main.show(followRequestPage);

    };

    controller.new_request = function(){
        var newFollowRequestPage = new App.Vitalis.Views.NewFollowRequestPage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Nueva solicitud"});

        App.header.show(innerHeaderView);
        App.main.show(newFollowRequestPage);
    };

    controller.modules = function(){
        var modulesPage = new App.Vitalis.Views.ModulesPage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Mis módulos"});

        App.header.show(innerHeaderView);
        App.main.show(modulesPage);
    };

    controller.new_monitoring = function(moduleId){
        var monitoring = new Vitalis.Models.ModuleMonitoring({module_id: moduleId});

        var newMonitoringPage = new App.Vitalis.Views.NewMonitoringPage({model: monitoring});
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Nuevo monitoreo"});

        App.header.show(innerHeaderView);
        App.main.show(newMonitoringPage);
    };

    controller.new_module = function(){
        var newModulePage = new App.Vitalis.Views.NewModulePage();
        var innerHeaderView = new App.Vitalis.Views.InnerHeader({title: "Nuevo módulo"});

        App.header.show(innerHeaderView);
        App.main.show(newModulePage);
    };


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
    addRoute('requests');
    addRoute('new_request');
    addRoute('modules');
    addRoute('new_monitoring');
    addRoute('new_module');

    App.Vitalis.Router = Marionette.AppRouter.extend({
        'appRoutes': routes,
        'controller': controller
    });
});