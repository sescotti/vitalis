// main.layout.view.js

'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis');

    Views.ModuleListItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.module_list_item,
        ui: {
            monitoringCard: 'li.collection-item',
            assignMonitoringButton: "li[data-role='assign-monitoring']",
            gotoMonitoringButton: "li[data-role='goto-monitoring']",
            deleteModuleButton: "li[data-role='delete-module']",
            moreInfoButton: "li[data-role='more-info']",
            confirmDeleteButton: "a[data-role='confirm-delete']"
        },

        events:{
            'click @ui.assignMonitoringButton': 'assignMonitoring',
            'click @ui.deleteModuleButton': 'deleteModule',
            'click @ui.moreInfoButton': 'goToModule',
            'click @ui.confirmDeleteButton': 'confirmDelete',
            'click @ui.gotoMonitoringButton': 'gotoMonitoring'
        },

        onShow: function(){
            $(document).ready(function(){
                // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
                $('.modal-trigger').leanModal();
            });
        },

        assignMonitoring: function(){
            var moduleId = this.model.get('id');
            Urls.go('vitalis:new_monitoring', [moduleId]);
        },

        deleteModule: function(){
            $('#delete-module-modal').openModal();
        },

        confirmDelete: function(){
            var serialNumber = this.model.get("serial_number");
            $('.modal').closeModal();
            this.model.destroy().then(function(){
                var message = "Eliminaste el módulo " + serialNumber;
                Materialize.toast(message, 3500, '', function(){});
            });
        },

        gotoMonitoring: function(){
            var monitoringId = this.model.get('monitoring').id;
            Urls.go('vitalis:monitoring', [monitoringId]);
        },

        goToModule: function(){

        }

    });
});