package com.rocket.vitalis.web.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping
public class SinglePageApplicationController {

    @RequestMapping(value={"/", "", "/login", "/signup", "/app", "/app/*"})
    public ModelAndView index(Model model) {

        model.addAttribute("title", "Un subtitulo home");
        return new ModelAndView("index", model.asMap());

//        return "index";
    }

}
