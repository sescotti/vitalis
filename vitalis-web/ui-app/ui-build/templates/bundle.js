this["App"] = this["App"] || {};
this["App"]["Vitalis"] = this["App"]["Vitalis"] || {};
this["App"]["Vitalis"]["templates"] = this["App"]["Vitalis"]["templates"] || {};
this["App"]["Vitalis"]["templates"]["main"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div>Main template</div>\n\n"
    + container.escapeExpression(((helper = (helper = helpers.sarasa || (depth0 != null ? depth0.sarasa : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"sarasa","hash":{},"data":data}) : helper)))
    + "\n\n<a id=\"goto-login\" href=\"#\">Ir a login</a>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["home"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"home-container\" class=\"app-container\">\n\n    <div id=\"mystatus\"></div>\n\n    <div id=\"following\"></div>\n\n\n  <div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n    <a class=\"btn-floating btn-large waves-effect waves-light\">\n      <i class=\"large material-icons\">add</i>\n    </a>\n    <ul>\n      <li>\n      <a class=\"btn-floating tooltipped blue\" data-role=\"execute-action\" data-target=\"vitalis:new_request\" data-position=\"left\" data-delay=\"50\" data-tooltip=\"Nueva solicitud\"><i class=\"material-icons\">person_add</i></a>\n      </li>\n      <li>\n      <a class=\"btn-floating tooltipped yellow darken-4\" data-role=\"execute-action\" data-target=\"vitalis:new_module\" data-position=\"left\" data-delay=\"50\" data-tooltip=\"Registrar nuevo m&oacute;dulo\"><i class=\"material-icons\">memory</i></a>\n      </li>\n      <li>\n      <a class=\"btn-floating tooltipped green\" data-position=\"left\" data-role=\"execute-action\" data-target=\"vitalis:new_alert\" data-delay=\"50\" data-tooltip=\"Nueva alerta\"><i class=\"material-icons\">notifications_active</i></a>\n      </li>\n    </ul>\n  </div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_my_follow_requests"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div style=\"text-align: center;\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">weekend</i></p>\n    <p class=\"no-upper-margin\">No tenés más solicitudes, ¡volvé pronto para chequear nuevamente!</p>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_other_follow_requests"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div class=\"center-align\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">weekend</i></p>\n    <p class=\"no-upper-margin\">No tenés más solicitudes de los pacientes que administras, ¡volvé pronto para chequear nuevamente!</p>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["follow_request_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<li class=\"collection-item avatar row\">\n	<div class=\"col s12 m6 l8\">\n		<img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.requested_by : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n		<span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.requested_by : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n		<p>Solicitado para "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.monitoring : depth0)) != null ? stack1.patient : stack1)) != null ? stack1.name : stack1), depth0))
    + "</p>\n	</div>\n\n    <div class=\"col s0 m6 l4 text-align-right\" >\n        <a href=\"#!\" data-role='accept-request' class=\"btn\">Aceptar</a>\n	    <a href=\"#!\" data-role='reject-request' class=\"btn btn-flat btn-secondary\">Rechazar</a>\n    </div>\n</li>\n\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["new_follow_request_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n\n<h5 class=\"subheader\">Buscar usuarios</h5>\n\n<nav>\n    <div class=\"nav-wrapper\">\n      <form id=\"search-form\">\n        <div class=\"input-field\">\n          <input id=\"search\" type=\"search\" autocomplete=\"off\" class=\"inherit-font-size\" required>\n          <label for=\"search\"><i class=\"material-icons\">search</i></label>\n          <i id=\"reset-btn\" class=\"material-icons\">close</i>\n        </div>\n      </form>\n    </div>\n</nav>\n\n<div id=\"search-results\" class=\"pad-top\"></div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["request_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n    <div id=\"my-requests\"></div>\n    <div id=\"other-requests\"></div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_following"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div style=\"text-align: center;\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">face</i></p>\n    <p class=\"no-upper-margin\">¿Tenés un familiar o amigo que usa <span class=\"brand\">Vitalis</span>?</p>\n    <a href=\"#\" class=\"waves-effect waves-light btn\">Seguilo</a>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_mystatus"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div style=\"text-align: center;\">\n    <p class=\"no-margin\"><i class=\"medium material-icons\">face</i></p>\n    <p class=\"no-upper-margin\">Todavía no registraste tu m&oacute;dulo <span class=\"brand\">Vitalis</span></p>\n    <a href=\"#\" class=\"waves-effect waves-light btn\">Hacelo acá</a>\n    </div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_summary"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n    <p>Última medici&oacute;n el "
    + alias2(((helper = (helper = helpers.last_monitoring_date || (depth0 != null ? depth0.last_monitoring_date : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"last_monitoring_date","hash":{},"data":data}) : helper)))
    + "\n    </p>\n    <a href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">keyboard_arrow_right</i></a>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["login"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"login-container app-container\">\n    <form class=\"container\">\n        <img id=\"hero-logo\" src=\"/img/logo-white-full.png\" alt=\"Vitalis\" class=\"center-image login-logo\"/>\n\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">email</i>\n            <input id=\"email\" class=\"login-input\" name=\"email\" type=\"email\" data-error=\"#error-email\">\n            <label for=\"email\" class=\"active\" data-error=\"Verifica este campo\">Correo electrónico</label>\n            <div id=\"error-email\"></div>\n        </div>\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">lock_outline</i>\n            <input id=\"password\" class=\"login-input\" name=\"password\" type=\"password\" data-error=\"#error-password\">\n            <label for=\"password\" class=\"active\" data-error=\"\">Contraseña</label>\n            <div id=\"error-password\"></div>\n        </div>\n        <div class=\"center-align col s6 login-btn-wrapper\">\n            <input class=\"waves-effect waves-light btn center-align full-width login-btn\" id=\"login\" type=\"button\" value=\"Ingresar\">\n            <a id=\"forgot-password-btn\" href=\"#\" class=\"display-block login-link\">¿Olvidaste tu contraseña?</a>\n        </div>\n        </form>\n        <div id=\"bottom-content center-align\">\n            <span class=\"login-text\" id=\"create-account\">\n                ¿No ten&eacute;s una cuenta? <a id=\"signup-now-btn\" href=\"#\" class=\"login-link\">Crea una</a>\n            </span>\n        </div>\n</div>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["signup"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"login-container app-container\">\n    <div class=\"container\">\n\n        <img id=\"hero-logo\" src=\"/img/logo-white-full.png\" alt=\"Vitalis\" class=\"center-image login-logo\"/>\n\n        <!--<h5 class=\"center-align\">Unite a la comunidad</h5>-->\n\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">email</i>\n            <input id=\"email\" class=\"login-input\" name=\"email\" type=\"email\" data-error=\"#error-email\">\n            <label for=\"email\" class=\"active\" data-error=\"Verifica este campo\">Correo electrónico</label>\n            <div id=\"error-email\"></div>\n        </div>\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">lock_outline</i>\n            <input id=\"password\" class=\"login-input\" name=\"password\" type=\"password\" data-error=\"#error-password\">\n            <label for=\"password\" class=\"active\" data-error=\"\">Contraseña</label>\n            <div id=\"error-password\"></div>\n        </div>\n        <div class=\"input-field\">\n            <i class=\"material-icons prefix login-input\">lock_outline</i>\n            <input id=\"password2\" class=\"login-input\" name=\"password2\" type=\"password\" data-error=\"#error-password\">\n            <label for=\"password2\" class=\"active\" data-error=\"\">Contraseña</label>\n            <div id=\"error-password\"></div>\n        </div>\n\n        <div class=\"center-align col s6\">\n            <input class=\"waves-effect waves-light btn center-align full-width signup-btn\" id=\"signup\" type=\"button\" value=\"Registrarme\">\n             <span class=\"login-text\" id=\"create-account\">\n                <a id=\"return-to-login-btn\" href=\"#\" class=\"display-block login-link\">Volver</a>\n            </span>\n        </div>\n    </div>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["module_list_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    	<span class=\"blue-text text-darken-4\">Asignado a "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.monitoring : depth0)) != null ? stack1.patient : stack1)) != null ? stack1.name : stack1), depth0))
    + "</span>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "		<p>No asignado</p>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "            <li class=\"collection-item modal-action modal-close\" data-role='goto-monitoring'>\n                <a href=\"#\"><i class=\"valign-bottom material-icons\">tv</i><span>Ver monitoreo</span></a>\n            </li>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "            <li class=\"collection-item modal-action modal-close\" data-role='assign-monitoring'>\n                <a href=\"#\"><i class=\"valign-bottom material-icons\">add_to_queue</i><span>Comenzar nuevo monitoreo</span></a>\n            </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\"collection-item avatar row\">\n	<div class=\"col s10 m6 l8\">\n		<img src=\""
    + alias3((helpers.img_url || (depth0 && depth0.img_url) || alias2).call(alias1,"logo-64x64-color.png",{"name":"img_url","hash":{},"data":data}))
    + "\" alt=\"\" class=\"measurement-icon\">\n		<span class=\"title\">M&oacute;dulo "
    + alias3(((helper = (helper = helpers.serial_number || (depth0 != null ? depth0.serial_number : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"serial_number","hash":{},"data":data}) : helper)))
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.monitoring : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "	</div>\n\n    <div class=\"col s2 m6 l4 right-align no-padding\" >\n    	<a href=\"#options-modal\" class=\"secondary-content modal-trigger\"><i class=\"material-icons\">more_vert</i></a>\n    </div>\n\n	<div id=\"options-modal\" class=\"modal bottom-sheet\">\n	<h5 class=\"subheader\">Opciones</h5>\n	<div>\n	  <ul class=\"collection\">\n	  	<li class=\"collection-item modal-action\" data-role='delete-module'>\n	  		<a href=\"#\"><i class=\"valign-bottom material-icons\">delete</i><span>Eliminar</span></a>\n	  	</li>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.monitoring : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\n	  	<li class=\"collection-item modal-action modal-close\" data-role='more-info'>\n	  		<a href=\"#\"><i class=\"valign-bottom material-icons\">info</i><span>Más informaci&oacute;n</span></a>\n	  	</li>\n	  </ul>\n	</div>\n	</div>\n\n	  	<!-- Modal Structure -->\n	<div id=\"delete-module-modal\" class=\"modal\">\n	    <div class=\"modal-content\">\n	      <h4>Eliminar m&oacute;dulo</h4>\n	      <p>¿Est&aacute; seguro que quiere eliminar este m&oacute;dulo? Este paso no se puede deshacer.</p>\n	    </div>\n	    <div class=\"modal-footer\">\n	      <a href=\"#!\" id=\"confirm-delete\" data-role=\"confirm-delete\" class=\"modal-action modal-close waves-effect waves-green btn-flat\">Eliminar</a>\n	      <a href=\"#!\" class=\"modal-action modal-close waves-effect waves-green btn-flat\">Cancelar</a>\n	    </div>\n  	</div>\n\n</li>\n\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["module_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n\n<div id=\"mymodules\"></div>\n\n\n<div class=\"fixed-action-btn\" style=\"bottom: 45px; right: 24px;\">\n    <a data-role=\"new-module\" class=\"btn-floating btn-large waves-effect waves-light\">\n        <i class=\"large material-icons\">add</i>\n    </a>\n</div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_page"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        	<p>"
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.height : stack1),"height",{"name":"measure","hash":{},"data":data}))
    + "</p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        	<p>"
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.weight : stack1),"weight",{"name":"measure","hash":{},"data":data}))
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<div class=\"app-container\">\n<h5 class=\"subheader\">Información del paciente</h5>\n    <ul class=\"collection\">\n    <li class=\"collection-item avatar\">\n        <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n        <span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.height : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.weight : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        \n        <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.blood_type : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.blood_factor : stack1), depth0))
    + "</p>\n    </li>\n</ul>\n\n<h5 class=\"subheader\">Información de monitoreo</h5>\n<div id=\"sensors\">\n</div>\n\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_search_result_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.picture_url : stack1), depth0))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.patient : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n    <button data-role=\"follow\" class=\"btn btn-floating secondary-content\"><i class=\"material-icons\">person_add</i></button>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <!--<i class=\"material-icons circle\">folder</i>-->\n    <img src=\""
    + alias3((helpers.img_url || (depth0 && depth0.img_url) || alias2).call(alias1,(helpers.concat || (depth0 && depth0.concat) || alias2).call(alias1,"icon_",(depth0 != null ? depth0.measurement_type : depth0),".png",{"name":"concat","hash":{},"data":data}),{"name":"img_url","hash":{},"data":data}))
    + "\" alt=\""
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.measurement_type : depth0),{"name":"tr","hash":{},"data":data}))
    + "\" class=\"measurement-icon\">\n    <span class=\"title\">"
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.measurement_type : depth0),{"name":"tr","hash":{},"data":data}))
    + "</span>\n    <p>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last_monitoring_date : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "    </p>\n    <p "
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"enabled",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n        "
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),{"name":"tr","hash":{},"data":data}))
    + "\n    </p>\n\n    <a href=\"#!\" class=\"last-measure secondary-content\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last_value : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "    </a>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last_value : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "            Última medici&oacute;n "
    + container.escapeExpression((helpers.formatRelative || (depth0 && depth0.formatRelative) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.last_monitoring_date : depth0),{"name":"formatRelative","hash":{},"data":data}))
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "            Sin mediciones\n";
},"6":function(container,depth0,helpers,partials,data) {
    return " class=\"blue-text text-darken-4\"";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || helpers.helperMissing).call(alias1,(depth0 != null ? depth0.measurement_type : depth0),"blood_pressure",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            "
    + alias4(((helper = (helper = helpers.last_value || (depth0 != null ? depth0.last_value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"last_value","hash":{},"data":data}) : helper)))
    + "/"
    + alias4(((helper = (helper = helpers.last_value_secondary || (depth0 != null ? depth0.last_value_secondary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"last_value_secondary","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "            "
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.last_value : depth0),(depth0 != null ? depth0.measurement_type : depth0),{"name":"measure","hash":{},"data":data}))
    + "\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "        - -\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "        <a href=\"#!\" class=\"secondary-content\"><i class=\"material-icons\">keyboard_arrow_right</i></a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.intl || (depth0 && depth0.intl) || helpers.helperMissing).call(depth0 != null ? depth0 : {},{"name":"intl","hash":{"locales":"es-AR"},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_measurement_chart"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<input type=\"hidden\" id=\"measurement_type\" value=\""
    + container.escapeExpression((helpers.tr || (depth0 && depth0.tr) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.measurementType : depth0),{"name":"tr","hash":{},"data":data}))
    + "\"></input>\n<canvas id=\"chart\">\n\n</canvas>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_measurement_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\"collection-item\">\n    <div>\n        El "
    + alias3((helpers.formatDate || (depth0 && depth0.formatDate) || alias2).call(alias1,(depth0 != null ? depth0.measurement_date : depth0),{"name":"formatDate","hash":{},"data":data}))
    + " a las "
    + alias3((helpers.formatTime || (depth0 && depth0.formatTime) || alias2).call(alias1,(depth0 != null ? depth0.measurement_date : depth0),{"name":"formatTime","hash":{"minute":"numeric","hour":"numeric"},"data":data}))
    + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"blood_pressure",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\n        \n    </div>\n\n</li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        	<a class=\"last-measure secondary-content\">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "/"
    + alias4(((helper = (helper = helpers.value_secondary || (depth0 != null ? depth0.value_secondary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value_secondary","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "        	<a class=\"secondary-content\">"
    + container.escapeExpression((helpers.measure || (depth0 && depth0.measure) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),(depth0 != null ? depth0.type : depth0),{"name":"measure","hash":{},"data":data}))
    + "</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.intl || (depth0 && depth0.intl) || helpers.helperMissing).call(depth0 != null ? depth0 : {},{"name":"intl","hash":{"locales":"es-AR"},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n    <div id=\"chart\"></div>\n    <h5 class=\"subheader\">Últimas mediciones</h5>\n    <div id=\"values\"></div>\n    <div id=\"alerts\"></div>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["monitoring_sensor_selection_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "checked";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias3((helpers.img_url || (depth0 && depth0.img_url) || alias2).call(alias1,(helpers.concat || (depth0 && depth0.concat) || alias2).call(alias1,"icon_",(depth0 != null ? depth0.type : depth0),".png",{"name":"concat","hash":{},"data":data}),{"name":"img_url","hash":{},"data":data}))
    + "\" alt=\""
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"tr","hash":{},"data":data}))
    + "\" class=\"measurement-icon\">\n    <span class=\"title\">"
    + alias3((helpers.tr || (depth0 && depth0.tr) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),{"name":"tr","hash":{},"data":data}))
    + "</span>\n\n    <div class=\"switch secondary-content\">\n        <label>\n            <input data-role=\"toggle-selection\" type=\"checkbox\" "
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.status : depth0),"enabled",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n            <span class=\"lever\"></span>\n        </label>\n    </div>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["new_monitoring_page"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"app-container\">\n\n    <div id=\"patient\"></div>\n\n    <div id=\"followers\"></div>\n\n    <div id=\"sensors\"></div>\n\n    <a data-role=\"init-monitoring\" class=\"waves-effect waves-light btn-large full-width\">\n        Iniciar monitoreo\n    </a>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["patients"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"home-container\" class=\"app-container\">\n    PACIENTES VIEJA\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_result_item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "        <button data-role=\"delete\" class=\"btn btn-floating btn-minimal btn-flat secondary-content\"><i class=\"material-icons\">close</i></button>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <button data-role=\"add\" class=\"btn btn-floating secondary-content\"><i class=\"material-icons\">person_add</i></button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.eq || (depth0 && depth0.eq) || alias2).call(alias1,(depth0 != null ? depth0.role : depth0),"delete",{"name":"eq","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_result_item_with_delete"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "checked";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n    <div class=\"switch\">\n        <label>\n            Administrador\n            <input data-role=\"admin\" type=\"checkbox\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.is_admin : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n            <span class=\"lever\"></span>\n        </label>\n    </div>\n    <button data-role=\"delete\" class=\"btn btn-floating btn-minimal btn-flat secondary-content\"><i class=\"material-icons\">close</i></button>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["collection_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<ul class=\"collection\">\n\n</ul>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["collection_wrapper_with_title"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<h5 class=\"subheader\">"
    + container.escapeExpression(((helper = (helper = helpers.collection_title || (depth0 != null ? depth0.collection_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"collection_title","hash":{},"data":data}) : helper)))
    + "</h5>\n<ul class=\"collection\">\n\n</ul>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["collection_wrapper_with_title_and_action"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=container.lambda;

  return "<div class=\"row\">\n<div class=\"col s10 m10 l10\">\n	<h5 class=\"subheader\">"
    + alias1(((helper = (helper = helpers.collection_title || (depth0 != null ? depth0.collection_title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"collection_title","hash":{},"data":data}) : helper)))
    + "</h5>\n</div>\n<div class=\"col s2 m2 l2 right-align\">\n	<a href=\"#\" data-role=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.action : depth0)) != null ? stack1.role : stack1), depth0))
    + "\"><i class=\"material-icons\">"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.action : depth0)) != null ? stack1.icon : stack1), depth0))
    + "</i></a>\n</div>\n</div>\n<ul class=\"collection\">\n\n</ul>\n<div id=\"action-container\"></div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["content"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "||CONTENTO||";
},"useData":true});
this["App"]["Vitalis"]["templates"]["footer"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "||FUTER||";
},"useData":true});
this["App"]["Vitalis"]["templates"]["header"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<ul id=\"nav-mobile\" class=\"side-nav top-of-the-rock\">\n    <li>\n        <div class=\"userView row\">\n\n            <div class=\"col s9 m9 l9\">\n                <img class=\"background\" src=\"/img/navbar-background.png\">\n                <a href=\"#!user\"><img class=\"circle\" src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\"></a>\n                <a href=\"#!name\"><span class=\"white-text name\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span></a>\n                <a href=\"#!email\"><span class=\"white-text email\">"
    + alias4(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"email","hash":{},"data":data}) : helper)))
    + "</span></a>\n            </div>\n            <div class=\"col s3 m3 l3\" id=\"logout-div\">\n                <a href=\"#!email\" data-role=\"navbar-link\" data-link=\"vitalis:logout\"><i class=\"white-text material-icons\">exit_to_app</i></a>\n            </div>\n\n\n    </div></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:home\"><i class=\"material-icons\">home</i>Página principal</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:mydata\"><i class=\"material-icons\">assignment</i>Mis datos</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:requests\"><i class=\"material-icons\">person_add</i>Solicitudes</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:alerts\"><i class=\"material-icons\">notifications_active</i>Alertas</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:patients\"><i class=\"material-icons\">group</i>Usuarios monitoreados</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:modules\"><i class=\"material-icons\">memory</i>Módulos</a></li>\n    <li><div class=\"divider\"></div></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:medics\"><i class=\"material-icons\">perm_identity</i>Médicos</a></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:settings\"><i class=\"material-icons\">settings</i>Configuración</a></li>\n    <li><div class=\"divider\"></div></li>\n    <li><a href=\"#!\" data-role=\"navbar-link\" data-link=\"vitalis:logout\"><i class=\"material-icons\">exit_to_app</i>Salir</a></li>\n\n</ul>\n\n<div id=\"header-container\">\n\n<div id=\"preloader-header\" class=\"progress no-margin hidden\">\n    <div class=\"indeterminate\"></div>\n</div>\n\n<nav>\n    <div class=\"nav-wrapper\">\n\n        <a id=\"menu-btn\" href=\"#\" data-activates=\"nav-mobile\" class=\"button-collapse pad-left\"><i class=\"material-icons\">menu</i></a>\n\n        <a href=\"#\" class=\"brand-logo\">Vitalis</a>\n        <ul class=\"right\">\n            <li>\n                <a href=\"#\" data-activates=\"nav-mobile\" >\n                    <i class=\"material-icons\">notifications</i>\n                </a>\n            </li>\n        </ul>\n    </div>\n</nav>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["header"] = this["App"]["Vitalis"]["templates"]["header"] || {};
this["App"]["Vitalis"]["templates"]["header"]["inner"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <a class=\"brand-logo\">"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <a class=\"nav-title\">"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "            <ul class=\"right\">\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <li>\n                    <a href=\"#\" data-role=\"secondary-action\">\n                        <i class=\"material-icons\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.secondary_action : depth0)) != null ? stack1.icon : stack1), depth0))
    + "</i>\n                    </a>\n                </li>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.menu : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <li>\n                    <a href=\"#\" data-activates='menu-dropdown' class=\"dropdown-button\" data-constrainwidth=\"false\" data-beloworigin=\"true\">\n                        <i class=\"material-icons\">more_vert</i>\n                    </a>\n\n                    <ul id='menu-dropdown' class='dropdown-content'>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.menu : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </ul>\n\n                </li>\n\n                ";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <li data-role=\"menu-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><a href=\"#!\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</a></li>\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "            </ul>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<div id=\"header-container\">\n\n    <div id=\"preloader-header\" class=\"progress no-margin hidden\">\n        <div class=\"indeterminate\"></div>\n    </div>\n\n    <nav>\n        <div class=\"nav-wrapper\">\n\n            <a id=\"back-btn\" href=\"#\" data-role='back-btn' data-activates=\"nav-mobile\" class=\"button-collapse pad-left\"><i class=\"material-icons\">keyboard_arrow_left</i></a>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.useBrandAsTitle : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,(depth0 != null ? depth0.secondary_action : depth0),(depth0 != null ? depth0.menu : depth0),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.secondary_action : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(helpers.or || (depth0 && depth0.or) || alias2).call(alias1,(depth0 != null ? depth0.secondary_action : depth0),(depth0 != null ? depth0.menu : depth0),{"name":"or","hash":{},"data":data}),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n\n\n\n        </div>\n    </nav>\n</div>\n\n<div id=\"actionable-container\"></div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["loginheader"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"preloader-header\" class=\"progress no-margin hidden\">\n    <div class=\"indeterminate\"></div>\n</div>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["navbar"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_follower_assignment_result_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n    <div class=\"center-align\">\n        <p>Todavía no asignaste a ningún seguidor</p>\n        <a id=\"assign\" class=\"btn waves-effect waves-light\">Asignar</a>\n    </div>\n    <div id=\"search-users-container\"></div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["empty_patient_assignment_result_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<li class=\"collection-item\">\n	<div class=\"center-align\">\n		<p>Todavía no asignaste a ningún paciente</p>\n		<a id=\"assign\" class=\"btn waves-effect waves-light\">Asignar</a>\n	</div>\n	<div id=\"search-users-container\"></div>\n</li>";
},"useData":true});
this["App"]["Vitalis"]["templates"]["patient_assignment_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"collection-item avatar\">\n    <img src=\""
    + alias4(((helper = (helper = helpers.picture_url || (depth0 != null ? depth0.picture_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"picture_url","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" class=\"circle\">\n    <span class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n</li>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_modal_single_selection_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"search-users\" class=\"modal full-width no-margin\">\n	<div class=\"modal-content\">\n		<h4>Buscar usuarios</h4>\n		<nav>\n		    <div class=\"nav-wrapper\">\n		      <form id=\"search-form\">\n		        <div class=\"input-field\">\n		          <input id=\"search\" type=\"search\" autocomplete=\"off\" class=\"inherit-font-size\" required>\n		          <label for=\"search\"><i class=\"material-icons\">search</i></label>\n		          <i id=\"reset-btn\" class=\"material-icons\">close</i>\n		        </div>\n		      </form>\n		    </div>\n		</nav>\n\n		<div id=\"search-results\" class=\"pad-top\"></div>\n\n		</div>\n	</div>\n</div>\n";
},"useData":true});
this["App"]["Vitalis"]["templates"]["user_search_result_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"input-field\">\n	<select class=\"icons\"></select>\n</div>";
},"useData":true});