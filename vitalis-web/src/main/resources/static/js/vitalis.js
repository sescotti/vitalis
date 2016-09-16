var VitalisApp = Marionette.Application.extend({
    initialize: function(options) {
        console.log('My container:', options.container);

    }
});

// Although applications will not do anything
// with a `container` option out-of-the-box, you
// could build an Application Class that does use
// such an option.
var app = new VitalisApp({container: '#app'});

var options = {
    something: "some value",
    another: "#some-selector"
};

app.on("before:start", function(options){
    options.moreData = "Yo dawg, I heard you like options so I put some options in your options!";
});

app.on("start", function(options){

    if (Backbone.history){
        Backbone.history.start();
    }

    var layoutView = new LayoutView();
    layoutView.render();
    layoutView.header.show(new HeaderView());
    layoutView.content.show(new ContentView());
    layoutView.footer.show(new FooterView());


});

var Header = Marionette.Region.extend({
    el: "#headin",

    initialize: function(options){
        console.log("Init header");
    },

    onShow: function(view, region, options){
        view.render();
    },
});

var Content = Marionette.Region.extend({
    el: "#contentin",
    initialize: function(options){
        console.log("Init content");
    },

    onShow: function(view, region, options){
        view.render();
    },
    // $el - it's a cached jQuery object (el), in which you can use jQuery functions to push content. Like the Hello World in this case.
    render: function(){
        this.$el.html("<h2>Content</h2>");
    }
});

var Footer = Marionette.Region.extend({
    el: "#footin",
    initialize: function(options){
        console.log("Init footer");
    },

    onShow: function(view, region, options){
        view.render();
    },
    // $el - it's a cached jQuery object (el), in which you can use jQuery functions to push content. Like the Hello World in this case.
    render: function(){
        this.$el.html("<h1>Footer</h1>");
    }
});

var LayoutView = Marionette.LayoutView.extend({
    template: "#app",

    regions: {
        header: Header,
        content: Content,
        footer: Footer
    }
});


var HeaderView = Marionette.ItemView.extend({
    render: function(){
        this.$el.html("<h1>Header</h1>");
    }
});

var ContentView = Marionette.ItemView.extend({
    render: function(){
        this.$el.html("<h1>Content</h1>");
    }
});
var FooterView = Marionette.ItemView.extend({
    render: function(){
        this.$el.html("<h1>Footer</h1>");
    }
});

app.start(options);