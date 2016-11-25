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

        regions: {
            actionableContainer: 'div#actionable-container'
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

        onShow: function(){
            $('.dropdown-button').dropdown({
                    inDuration: 300,
                    outDuration: 225,
                    constrain_width: true, // Does not change width of dropdown to that of the activator
                    hover: true, // Activate on hover
                    gutter: 0, // Spacing from edge
                    belowOrigin: true, // Displays dropdown below the button
                    alignment: 'left' // Displays dropdown with edge aligned to the left of button
                }
            );
        },

        goBack: function(a){
            //if(window.history.state == null){
            //    Urls.go('vitalis:home');
            //} else {
                window.history.back();
            //}
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
                    var actionableContainer = this.getRegion('actionableContainer');
                    option.action(event, actionableContainer);
                    break;
                }
            }
        }

    });
});