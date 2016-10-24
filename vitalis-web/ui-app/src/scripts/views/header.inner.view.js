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
            secondaryActionButton: 'a[data-role="secondary-action"]',
            menuOption: 'li[data-role^="menu-"]'
        },

        events:{
            'click @ui.backButton': 'goBack',
            'click @ui.secondaryActionButton': 'executeSecondaryAction',
            'click @ui.menuOption' : 'executeMenuAction'
        },

        templateHelpers: function(){
            var useBrandAsTitle = this.getOption('title') === undefined
            var title = useBrandAsTitle ? "Vitalis" : this.getOption('title');
            return {
                useBrandAsTitle: useBrandAsTitle,
                title: title,
                secondary_action: this.getOption('secondary_action'),
                menu: this.getOption('menu')
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
        },

        executeMenuAction: function(event){
            var trigger = event.target;
            var menuOptions = this.getOption('menu');
            for(var index in menuOptions.options){
                var option = menuOptions.options[index];
                if(option.id == [trigger.id]){
                    option.action(event);
                    break;
                }
            }
        }

    });
});