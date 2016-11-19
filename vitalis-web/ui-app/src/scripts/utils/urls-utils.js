'use strict';

App.module('Urls', function (Urls, App, Backbone, Marionette, $, _){

    // Flag with allows to show a confirmation message while leaving the page
    Urls._preventLeavingPage = false;

    /**
     * Our navigation method for checkout, which always include the shopId+cartId
     * @param {String} key The key for the url (from the `urls.json`)
     * @param {Array} replacements The values to replace params in the url.
     * @param {Array} options Options for the `Backbone.history.navigate` function.
     */
    Urls.go = function (key, replacements, options) {

        var _options = _.extend(
            {
                'trigger': true,
                //silent:false
            },
            options
        );

        Backbone.history.navigate(Urls.get(key, replacements), _options);
        //Backbone.history.loadUrl( Backbone.history.fragment);

    };

    /**
     * "Reloads" the current page, but using a Backbone reload, not a full-page
     * reload, i.e. reloads the views.
     */
    Urls.reload = function () {
        Backbone.history.loadUrl(Backbone.history.fragment);
    };

    /**
     * Sets the variable `_preventLeavingPage` with a certain value, which
     * is used in the `window.onbeforeunload` event to show a confirmation modal
     * to avoid leaving the current page.
     * @param {Boolean} isPreventing True if it should show a prompt.
     */
    Urls.setPreventLeavingPage = function (isPreventing) {
        this._preventLeavingPage = isPreventing;
    };

});