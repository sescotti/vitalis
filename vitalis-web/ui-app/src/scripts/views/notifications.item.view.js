'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.NotificationsListItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.notifications_item,

        ui: {
            ackButton: 'li[data-role="ack-notification"]',
            closeButton: 'li[data-role="close-notification"]',
            moreOptionsButton: 'a.modal-trigger',
            gotoMonitoringButton: 'li[data-role="goto-monitoring"]'
        },

        events: {
            'click @ui.adminCheckbox': 'updateAdmin',
            'click @ui.moreOptionsButton': 'openOptionsModal',
            'click @ui.closeButton': 'closeAlert',
            'click @ui.ackButton': 'ackAlert',
            'click @ui.gotoMonitoringButton': 'gotoMonitoring'
        },

        onShow: function(){
            $(document).ready(function(){
                $('.modal').leanModal({
                    complete: function(){
                        $('.lean-overlay').remove();
                    }
                });
            });
        },

        openOptionsModal: function(e){
            var link = $(e.currentTarget);
            var modalRef = link.attr('data-link');

            $(modalRef).openModal();
        },

        ackAlert: function(){
            var self = this;
            var modalId = $('.modal').attr('id');
            $('#'+modalId).closeModal();
            $('.lean-overlay').remove();
            this.model.save({status: 'acked'},
                {
                    success: function (model) {
                        self.render();
                        Utils.toast('Notificación marcada como vista')
                    },
                    error: function(model){
                        Utils.toast('Ups! No pudimos actualizar la notificación')
                    }
                }
            );
        },
        closeAlert: function(){
            var self = this;
            var modalId = $('.modal').attr('id');
            $('#'+modalId).closeModal();
            $('.lean-overlay').remove();
            this.model.save({status: 'closed'},
                {
                    success: function (model) {
                        self.render();
                        Utils.toast('Notificación marcada como cerrada')
                    },
                    error: function(model){
                        Utils.toast('Ups! No pudimos actualizar la notificación')
                    }
                }
            );
        },

        gotoMonitoring: function(){
            $('.modal').closeModal();
            $('.lean-overlay').remove();
            var monitoringId = this.model.get('monitoring').id;
            Urls.go('vitalis:monitoring', [monitoringId]);
        }


    });
});