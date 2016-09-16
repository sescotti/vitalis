/* global exports */

exports.initialScripts = [
    // Vendors
    './node_modules/backbone.radio/build/backbone.radio.min.js',
    './node_modules/jquery-mask-plugin/dist/jquery.mask.js',
    './node_modules/jquery-touch-events/index.js',

    // Temp
    './node_modules/jquery-mockjax/dist/jquery.mockjax.min.js',
    './mocks/mocks.js',

    // Constants module
    './src/scripts/modules/helpers/constants.module.js',

    // Models
    './src/scripts/models/*.model.js',

    // Handlebars
    './src/scripts/modules/extend/handlebars-helpers.module.js'
];

exports.scripts = [
    // Components (module, model, view)
    './src/components/fixed-bottom/fixed-bottom.*.js',
    './src/components/header/header.*.js',
    './src/components/modal/modal.*.js',
    './src/components/switch/switch.*.js',

    // Views
    './src/scripts/views/contact/billing-info-real.item.view.js',
    './src/scripts/views/contact/billing-info-legal.item.view.js',
    './src/scripts/views/contact/client-address-auto.item.view.js',
    './src/scripts/views/contact/client-address-form.item.view.js',

    './src/scripts/views/confirm/address.item.view.js',
    './src/scripts/views/confirm/confirm-discounts.item.view.js',
    './src/scripts/views/confirm/payment.item.view.js',

    './src/scripts/views/payment/offline.item.view.js',
    './src/scripts/views/payment/coupon.item.view.js',
    './src/scripts/views/payment/credit-card.item.view.js',
    './src/scripts/views/payment/custom.item.view.js',
    './src/scripts/views/payment/form-inputs.item.view.js',
    './src/scripts/views/payment/installments.item.view.js',
    './src/scripts/views/payment/issuer.item.view.js',
    './src/scripts/views/payment/methods.item.view.js',

    // Layouts
    './src/scripts/views/contact/client-address.layout.view.js',
    './src/scripts/views/contact/client-address-form.layout.view.js',
    './src/scripts/views/contact/contact.layout.view.js',
    './src/scripts/views/congrats/congrats.layout.view.js',
    './src/scripts/views/confirm/confirm.layout.view.js',
    './src/scripts/views/confirm/totals.layout.view.js',
    './src/scripts/views/payment/form.layout.view.js',
    './src/scripts/views/payment/payments.layout.view.js',
    './src/scripts/views/error.layout.view.js',

    // Modules
    './src/scripts/modules/checkout/credit-card.module.js',
    './src/scripts/modules/checkout/discounts.module.js',
    './src/scripts/modules/checkout/environment.module.js',
    './src/scripts/modules/checkout/error.module.js',
    './src/scripts/modules/checkout/mercadopago.module.js',

    './src/scripts/modules/extend/handlebars-partials.module.js',
    './src/scripts/modules/extend/urls.module.js',
    './src/scripts/modules/extend/utils.module.js',

    './src/scripts/modules/helpers/logger.module.js',
    './src/scripts/modules/helpers/i18n.module.js',
    './src/scripts/modules/helpers/state.module.js',
    './src/scripts/modules/helpers/validations.module.js',

    // Modules from Components
    './src/scripts/modules/components/fixed-bottom.module.js',
    './src/scripts/modules/components/header.module.js',

    // Tracking modules
    './src/scripts/modules/tracking/*.module.js'

];

exports.styles = [];

exports.fonts = [
    './node_modules/mshops-chico_theme/build/assets/*.{ttf,woff,eof,svg}'
];

exports.images = [
    './src/images/**/*.{png,jpg,ico,svg}',
    './node_modules/chico-mercadoshops-theme/build/assets/*.{png,jpg,ico,svg}'
];

exports.urls = [];

exports.mocks = [
    './src/mocks/**/*.json'
];

exports.partials = [
    './src/templates/partials/_*.hbs',
    './node_modules/mshops-chico_theme/src/components/spinner/spinner.component.hbs'
];

exports.templates = [
    './src/templates/shared/**/[^_]*.hbs',
    './src/components/**/[^_]*.hbs',
    './node_modules/ui-price_component/src/templates/_price.hbs'
];