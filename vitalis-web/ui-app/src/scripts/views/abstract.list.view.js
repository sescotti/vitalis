// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    Views.AbstractListView = Marionette.CompositeView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title,
        childViewContainer: "ul.collection",

        templateHelpers: function() {
            return {
                collection_title: this.getOption('title')
            }
        }
    });

    Views.GenericSelectView = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.select_wrapper_with_title,
        //childViewContainer: "select.collection-select",

        ui: {
           select: 'select.collection-select'
        },

        events: {
            'change @ui.select': 'onSelectOptionChange'
        },

        templateHelpers: function() {
            var hasSelectedItem = !!this.getOption('selected_item');
            return {
                collection_title: this.getOption('title'),
                select_id: this.getOption('select_id'),
                default_option: this.getOption('default_option'),
                items: this.getOption('items'),
                selected_item: this.getOption('selected_item'),
                has_selected_item: hasSelectedItem
            }
        },

        onShow: function(){
            $('select').material_select();
        },

        onSelectOptionChange: function (e) {
            var option = e.target.value;
            this.trigger('option:changed', option);
        }

    });

    Views.AbstractActionableListView = Views.AbstractListView.extend({
        template: App.Vitalis.templates.collection_wrapper_with_title_and_action,

        templateHelpers: function(){
            return {
                collection_title: this.getOption('title'),
                action: this.getOption('action')
            }
        }
    });
});