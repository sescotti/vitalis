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
            deleteModuleButton: "li[data-role='delete-module']",
            moreInfoButton: "li[data-role='more-info']",
            confirmDeleteButton: "a[data-role='confirm-delete']"
        },

        events:{
            'click @ui.assignMonitoring': 'assignMonitoring',
            'click @ui.deleteModuleButton': 'deleteModule',
            'click @ui.moreInfoButton': 'goToModule',
            'click @ui.confirmDeleteButton': 'confirmDelete'

        },

        onShow: function(){
            $(document).ready(function(){
                // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
                $('.modal-trigger').leanModal();
            });
        },

        assignMonitoring: function(){
            var moduleId = this.model.get('id');
            Urls.go('vitalis:new-monitoring', [moduleId]);
        },

        deleteModule: function(){
            $('#delete-module-modal').openModal();
        },

        confirmDelete: function(){
            var serialNumber = this.model.get("serial_number");
            this.model.destroy().then(function(){
                $('#options-modal').closeModal();
                var message = "Eliminaste el módulo " + serialNumber;
                Materialize.toast(message, 3500, '', function(){});
            });
        },

        goToModule: function(){

        }

    });
});