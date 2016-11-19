// main.layout.view.js
'use strict';
App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {
    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    var ENTER_KEY = 13;
    Views.MyData = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.mydata,
        ui: {
            'inputs': 'input, select',
        },

        events: {
            'submit #mydataForm': 'onSubmit',
            'blur @ui.inputs': 'setModelData',
            'change @ui.inputs': 'setModelData',
            'keydown': 'keyaction'
        },
        initialize: function(){
            var self = this;
            this.model.fetch().then(function(){
                self.render();
                //var sensorsCollection = new Vitalis.Models.Sensors(self.model.get('sensors'));
                //var sensorsView = new App.Vitalis.Views.MonitoringSensorMeasurementList({collection: sensorsCollection});
                //self.getRegion('sensors').show(sensorsView);
            });
        },

        onRender: function(){
            $(document).ready(function() {
                $('select').material_select();
                Materialize.updateTextFields();
            });
        },

        keyaction: function(e){
            if(e.which === ENTER_KEY){
                this.setModelData(e);
            }
        },

        onSubmit: function() {
            this.model.save({}, {beforeSend : function(xhr){
                xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
            }});
            return false;
        },

        setModelData: function(event){
            this.model.set(event.target.name, event.target.value);
        }
    });
});