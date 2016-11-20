// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.MedicsPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_follow_request_page,

        ui: {
            searchField: 'input#search',
            resetButton: 'i#reset-btn',
            searchForm: 'form#search-form'
        },

        events: {
            'keyup @ui.searchField': 'search',
            'click @ui.resetButton': 'resetSearch',
            'submit @ui.searchForm': 'onSubmit'
        },

        regions: {
            searchResults: 'div#search-results'
        },

        onShow: function(){
            var usersList = new Vitalis.Models.UserSearchList();
            var searchResultsView = new Views.SearchMonitoringsResultsListView({collection: usersList,
                title: "Resultados de búsqueda",
                childView: Views.MedicsSearchResultItemView});

            this.collection = usersList;

            //searchResultsView.on('validate:medic', function(args){
            //    args.model.save({'is_doctor': true}, {
            //        success: function(){
            //            Utils.toast('Médico validado');
            //    }});
            //});

            this.getRegion('searchResults').show(searchResultsView);
        },

        search: function(e){
            var searchQuery = e.target.value;
            var self = this;
            if(searchQuery.length > 3){
                this.collection.fetch({data: $.param({query: searchQuery})});
            } else {
                this.collection.reset();
            }
        },

        resetSearch: function(){
            $(this.ui.searchField).val('');
            this.collection.reset();
        },

        onSubmit: function(e){
            e.preventDefault();
        }
    });
});