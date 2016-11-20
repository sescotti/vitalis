'use strict';

App.module('Vitalis.Views', function (Views, App, Backbone, Marionette, $, _) {

    var Urls        = App.module('Urls'),
        Header      = App.module('Header'),
        Vitalis     = App.module('Vitalis'),
        Utils       = App.module('Vitalis.Utils');

    Views.MedicsSearchResultItemView = Marionette.ItemView.extend({
        template: App.Vitalis.templates.medic_search_result_item,

        ui: {
            validateButton: 'button[data-role="validate"]',
            revokeValidationButton: 'button[data-role="revoke-validation"]',
        },

        events:{
            'click @ui.validateButton': 'validateMedic',
            'click @ui.revokeValidationButton': 'revoke:medic'
        },

        templateHelpers: function(){
            var role = this.getOption('role');
            return {
                role: role
            };
        },

        validateMedic: function(event){
            var validateButton = event.target;
            this.model.save({'is_doctor': true}, {
                success: function(){
                    $(validateButton).text('');
                    //$(validateButton).parent().prop('disabled', true);
                    $(validateButton).parent().addClass('btn-flat secondary-content');
                    Utils.toast('Médico validado');
            }});
        }
    });
});