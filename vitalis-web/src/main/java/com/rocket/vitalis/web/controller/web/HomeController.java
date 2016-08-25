package com.rocket.vitalis.web.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

    @RequestMapping({"/"})
    public ModelAndView index(Model model) {

        model.addAttribute("title", "Un subtitulo home");
        return new ModelAndView("sensor", model.asMap());

//        return "index";
    }

}
