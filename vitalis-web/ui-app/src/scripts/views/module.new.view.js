// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.NewModulePage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_module_page,

        ui: {
            inputs: 'input[type="text"]',
            registerButton: 'a#register'

        },

        events: {
            'blur @ui.inputs': 'setModelData',
            'click @ui.registerButton': 'registerModule'
        },

        initialize: function(){
            this.model = new Vitalis.Models.Module();
        },

        onShow: function(){
            $(document).ready(function(){
                Materialize.updateTextFields();
            });
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        },

        registerModule: function(event){
            var self = this;
            this.model.save({}, {success: function(){
                var message = 'Registraste correctamente el módulo ' + self.model.get('serial_number');
                Utils.toast(message);
                Urls.go('vitalis:modules');
            }, error: function(){
                var message = 'El módulo ' + self.model.get('serial_number') + 'ya se encuentra registrado';
                Utils.toast(message);
            }});
        }

    });
});