// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.NewModulePage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_module_page,

        regions: {
            myModules: '#mymodules'
        },

        onShow: function(){
            var modulesList     = new Vitalis.Models.ModulesList();
            var modulesListView = new App.Vitalis.Views.ModulesListView({collection: modulesList, title: "Información módulos"});

            this.getRegion('myModules').show(modulesListView);
        }

    });
});