
'use strict';

App.module('Utils.Vitalis', function (UtilsShipping, App, Backbone, Marionette, $, _){

    //var Config = App.module('Config');

     //Flag with allows to show a confirmation message while leaving the page
    //Urls._preventLeavingPage = false;
    //
    ///**
    // * Our navigation method for checkout, which always include the shopId+cartId
    // * @param {String} key The key for the url (from the `urls.json`)
    // * @param {Array} replacements The values to replace params in the url.
    // * @param {Array} options Options for the `Backbone.history.navigate` function.
    // */
    //Urls.go = function (key, replacements, options) {
    //
    //    var _options = _.extend(
    //        {'trigger': true},
    //        options
    //    );
    //
    //    Backbone.history.navigate(Urls.get(key, replacements), _options);
    //
    //};
    //
    ///**
    // * "Reloads" the current page, but using a Backbone reload, not a full-page
    // * reload, i.e. reloads the views.
    // */
    //Urls.reload = function () {
    //    Backbone.history.loadUrl(Backbone.history.fragment);
    //};
    //
    ///**
    // * Sets the variable `_preventLeavingPage` with a certain value, which
    // * is used in the `window.onbeforeunload` event to show a confirmation modal
    // * to avoid leaving the current page.
    // * @param {Boolean} isPreventing True if it should show a prompt.
    // */
    //Urls.setPreventLeavingPage = function (isPreventing) {
    //    this._preventLeavingPage = isPreventing;
    //};

});
'use strict';

App.module('Urls', function (Urls, App, Backbone, Marionette, $, _){

    // Flag with allows to show a confirmation message while leaving the page
    Urls._preventLeavingPage = false;

    /**
     * Our navigation method for checkout, which always include the shopId+cartId
     * @param {String} key The key for the url (from the `urls.json`)
     * @param {Array} replacements The values to replace params in the url.
     * @param {Array} options Options for the `Backbone.history.navigate` function.
     */
    Urls.go = function (key, replacements, options) {

        var _options = _.extend(
            {'trigger': true},
            options
        );

        Backbone.history.navigate(Urls.get(key, replacements), _options);

    };

    /**
     * "Reloads" the current page, but using a Backbone reload, not a full-page
     * reload, i.e. reloads the views.
     */
    Urls.reload = function () {
        Backbone.history.loadUrl(Backbone.history.fragment);
    };

    /**
     * Sets the variable `_preventLeavingPage` with a certain value, which
     * is used in the `window.onbeforeunload` event to show a confirmation modal
     * to avoid leaving the current page.
     * @param {Boolean} isPreventing True if it should show a prompt.
     */
    Urls.setPreventLeavingPage = function (isPreventing) {
        this._preventLeavingPage = isPreventing;
    };

});
App.module('Vitalis', function () {});
this["App"] = this["App"] || {};
this["App"]["Vitalis"] = this["App"]["Vitalis"] || {};
this["App"]["Vitalis"]["templates"] = this["App"]["Vitalis"]["templates"] || {};
this["App"]["Vitalis"]["templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div>Main template</div>\n\n"
    + container.escapeExpression(((helper = (helper = helpers.sarasa || (depth0 != null ? depth0.sarasa : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"sarasa","hash":{},"data":data}) : helper)))
    + "\n\n<a id=\"goto-login\" href=\"#\">Ir a login</a>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["login"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"login-container\">\n    <div class=\"container\">\n\n    <img src=\"/img/logo-white-full.png\" alt=\"Vitalis\" class=\"center-image login-logo\"/>\n\n    <div class=\"input-field\">\n        <i class=\"material-icons prefix login-input\">account_circle</i>\n        <input class=\"login-input\" name=\"username\" type=\"text\" placeholder=\"Nombre de usuario\" value=\"\">\n    </div>\n    <div class=\"input-field\">\n        <i class=\"material-icons prefix login-input\">lock_outline</i>\n        <input class=\"login-input\" name=\"password\" type=\"password\" placeholder=\"Contraseña\" value=\"\">\n    </div>\n    <div class=\"center-align col s6\">\n        <input class=\"waves-effect waves-light btn center-align full-width login-btn\" id=\"login\" type=\"button\" value=\"Ingresar\">\n        <a id=\"forgot-password-btn\" class=\"display-block login-link\">¿Olvidaste tu contraseña?</a>\n    </div>\n    </div>\n    <div id=\"bottom-content\">\n        <span class=\"login-input\">¿No tienes una cuenta?</span>&nbsp;<a id=\"signup-now-btn\" class=\"login-link\">Crea una</a>\n    </div>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["content"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "||CONTENTO||";
},"useData":true});
this["App"]["Vitalis"]["templates"]["footer"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "||FUTER||";
},"useData":true});
this["App"]["Vitalis"]["templates"]["header"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "||JEDER||";
},"useData":true});
App.Urls.set(({
  "es": {
    "vitalis:index": "",
    "vitalis:login": "login"
  }
})[App.Config.lang]);
App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    Models.Login = Backbone.Model.extend({
        defaults: {
            'username': null,
            'password': null
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.Login = Marionette.LayoutView.extend({

        template: App.Vitalis.templates.login,

        ui: {
            'inputs': 'input[type=text], input[type=password]',
            'login_button': 'input#login'
        },

        events: {
            'click @ui.login_button': 'onLogin',
            'blur @ui.inputs': 'setModelData'
        },

        onShow: function(){
            console.log('show');
        },

        onLogin: function(){
            console.log('username: '+ this.model.get("username") + "pass" + this.model.get("password"));
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        }
    });
});
// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls'),
        Header  = App.module('Header');


    Views.Main = Marionette.LayoutView.extend({

        className: 'ch-box',

        template: App.Vitalis.templates.main,

        ui: {
            goto_login_button: 'a#goto-login'
        },
        events:{
          'click @ui.goto_login_button': 'goToLogin'
        },
        templateHelpers: function() {
            return {
                sarasa: 'seba'
            }
        },

        onShow: function(){
            console.log('show');
        },

        goToLogin: function(){
            Urls.go('vitalis:login');
        }
    });
});
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

    App.Vitalis.Router = Marionette.AppRouter.extend({
        'appRoutes': routes,
        'controller': controller
    });
});
// vitalis.module.js

'use strict';

App.module('Vitalis', function (Vitalis, App, Backbone, Marionette, $, _) {

    //var Header = App.module('Header');

    App.Events = _.extend({}, Backbone.Events);
    Vitalis.Cache = {};

    Vitalis.onStart = function() {
        new Vitalis.Router();

        startModels();
    };

    function startModels(){
        Vitalis.Login = new Vitalis.Models.Login();
    }

});