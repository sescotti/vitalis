// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.InnerHeader = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.header.inner,

        ui: {
             backButton: 'a[data-role="back-btn"]',
             secondaryActionButton: 'a[data-role="secondary-action"]'

        },

        events:{
            'click @ui.backButton': 'goBack',
            'click @ui.secondaryActionButton': 'executeSecondaryAction'
        },

        templateHelpers: function(){
            var useBrandAsTitle = this.getOption('title') === undefined
            var title = useBrandAsTitle ? "Vitalis" : this.getOption('title');
            return {
                useBrandAsTitle: useBrandAsTitle,
                title: title,
                secondary_action: this.getOption('secondary_action')
            }
        },


        goBack: function(a){
            if(window.history.state == null){
                Urls.go('vitalis:home');
            } else {
                window.history.back();
            }
            //Urls.go('vitalis:home');
        },

        executeSecondaryAction: function(event){
            var secondaryActionOption = this.getOption('secondary_action');
            secondaryActionOption.action(event);
        }
    });
});