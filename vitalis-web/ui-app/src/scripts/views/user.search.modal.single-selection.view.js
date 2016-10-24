// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.UserSearchSingleSelectionModal = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.user_search_modal_single_selection_wrapper,
        childViewContainer: "div#search-results",

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
            var monitoringsList = new Vitalis.Models.UserSearchList();
            var searchResultsView = new App.Vitalis.Views.SearchMonitoringsResultsListView({collection: monitoringsList,
                                                                                            title: "Resultados de búsqueda"});
            var self = this;
            searchResultsView.on('add:user', function(args){
                console.log('add:user@modal_search_view');
                self.trigger('add:user', args);
            })

            this.collection = monitoringsList;
            this.getRegion('searchResults').show(searchResultsView);

            $(document).ready(function(){
                $('.modal').openModal();
            });
        },

        search: function(e){
            var searchQuery = e.target.value;

            var extraParams = this.getOption('extra_params');

            var searchParams = {query: searchQuery};

            if(extraParams){
                for(param in extraParams){
                    searchParams[param] = extraParams[param];
                }
            }


            if(searchQuery.length > 3){
                this.collection.fetch({data: $.param(searchParams)});
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