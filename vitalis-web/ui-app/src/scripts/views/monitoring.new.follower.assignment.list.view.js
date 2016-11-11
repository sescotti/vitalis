// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.MonitoringFollowerAssignmentListView = Views.AbstractActionableListView.extend({
        childView: App.Vitalis.Views.MonitoringFollowerAssignmentItemView,

        ui: {
            addButton: 'a[data-role="addFollower"]'
        },

        regions: {
            searchUsersContainer: 'div#action-container'
        },

        events: {
            'click @ui.addButton': 'showAddUserModal'
        },

        showAddUserModal: function(){
            var searchUsersModal = new Vitalis.Views.UserSearchSingleSelectionModal({});
            var self = this;
            searchUsersModal.on('add:user', function(args){
                console.log('add:user@empty_item');
                self.addUser(args, args.model)
            });

            this.getRegion('searchUsersContainer').show(searchUsersModal);

        },

        childEvents: {
            'add:user': 'addUser',
            'remove:user': 'removeUser',
            'before:render': 'doBeforeRender'
        },

        addUser: function(args, model) {
            console.log('add:user@final_list_view');
            $('.modal').closeModal();
            this.collection.add(model);
            //this.getRegion('searchUsersContainer').destroy();
            this._reInitializeRegions();
            this.render();
        },

        removeUser: function(args, model) {
            $('.modal').closeModal();
            this.collection.remove(args.model);

            this.render();
        },

        doBeforeRender: function(a, b){
            b.options.role = 'delete';
        },

        initialize: function(options) {
            //give this composite view a LayoutView behaviour with added region manager
            this.regionManager = new Marionette.RegionManager();
            _.each(["_initializeRegions", "_initRegionManager",
                "_buildRegions", "addRegion", "addRegions",
                "removeRegion", "getRegion", "getRegions",
                "_reInitializeRegions", "getRegionManager"], function(prop) {
                Marionette.CompositeView.prototype[prop] = Marionette.LayoutView.prototype[prop];
            });
            var that = this;
            _.each(this.regions, function(value, key) {
                var region = that.addRegion(key, value);
                that[key] = region;
            });

            if(this.getOption('prefetch')){
                this.collection.fetch();
            }
        },

        onDestroy: function() {
            this.regionManager.destroy();
        }


    });
});