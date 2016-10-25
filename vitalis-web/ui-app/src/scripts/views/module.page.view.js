// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.ModulesPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.module_page,

        ui: {
            addModuleButton: 'a[data-role="new-module"]'

        },

        events: {
            'click @ui.addModuleButton': 'addModule'
        },

        regions: {
            myModules: '#mymodules'
        },

        onShow: function(){
            var modulesList     = new Vitalis.Models.ModulesList();
            var modulesListView = new App.Vitalis.Views.ModulesListView({collection: modulesList, title: "Información módulos"});

            this.getRegion('myModules').show(modulesListView);
        },

        addModule: function(event){
            Urls.go('vitalis:new_module');
        }

    });
});