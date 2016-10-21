// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.NewFollowRequestPage = Marionette.LayoutView.extend({
        template: App.Vitalis.templates.new_follow_request_page,

        ui: {
            searchField: 'input#search',
            resetButton: 'i#reset-btn'
        },

        events: {
            'keyup @ui.searchField': 'search',
            'click @ui.resetButton': 'resetSearch'

        },

        regions: {
            searchResults: 'div#search-results'
        },

        onShow: function(){
            var monitoringsList = new Vitalis.Models.MonitoringsSearchList();
            var searchResultsView = new App.Vitalis.Views.SearchMonitoringsResultsListView({collection: monitoringsList,
                                                                                            title: "Resultados de búsqueda"});

            this.collection = monitoringsList;
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
        }
    });
});