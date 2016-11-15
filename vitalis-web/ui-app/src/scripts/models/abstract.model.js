App.module('Vitalis.Models', function (Models, App, Backbone, Marionette, $, _) {

    var Urls    = App.module('Urls');

    function fetch(args, options){

        $('#preloader-header').removeClass('hidden');

        args = args || {};

        var onError = args.error || function(model, response, options){};
        var onSuccess = args.success || function(model, response, options){};

        args.beforeSend = function(xhr){
            xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
        };

        args.error = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            if(response.status === 401){
                $('.modal').closeModal();
                Urls.go('vitalis:login')
            } else {
                onError(model, response, options);
            }
        };

        args.success = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            onSuccess(model, response, options);
        };

        return Backbone.Model.prototype.fetch.call(this, args, options);
    }

    function destroy(args, options){

        $('#preloader-header').removeClass('hidden');

        args = args || {};

        var onError = args.error || function(model, response, options){};
        var onSuccess = args.success || function(model, response, options){};

        args.beforeSend = function(xhr){
            xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
        };

        args.error = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            if(response.status === 401){
                $('.modal').closeModal();
                Urls.go('vitalis:login')
            } else {
                onError(model, response, options);
            }
        };

        args.success = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            onSuccess(model, response, options);
        };

        return Backbone.Model.prototype.destroy.call(this, args, options);
    }

    function save(args, options){
        $('#preloader-header').removeClass('hidden');

        args = args || {};
        options = options || {};

        var onError = options.error || function(model, response, options){};
        var onSuccess = options.success || function(model, response, options){};

        options.beforeSend = function(xhr){
            xhr.setRequestHeader('X-Auth-Token', localStorage.getItem('accesstoken'));
        };

        options.error = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            if(response.status === 401){
                $('.modal').closeModal();
                Urls.go('vitalis:login')
            } else {
                onError(model, response, options);
            }
        };

        options.success = function(model, response, options){
            $('#preloader-header').addClass('hidden');
            onSuccess(model, response, options);
        };


        return Backbone.Model.prototype.save.call(this, args, options);
    }


    Models.AbstractModel = Backbone.Model.extend({
        fetch: fetch,
        save: save,
        destroy: destroy
    });

    Models.AbstractCollection = Backbone.Collection.extend({
        fetch: fetch,
        save: save,
        destroy: destroy
    });

});