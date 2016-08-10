package com.rocket.vitalis.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by sscotti on 8/9/16.
 */
@Controller
public class LoginController {

    @RequestMapping({"/login"})
    public ModelAndView index(Model model) {

        model.addAttribute("title", "Un subtitulo");
        return new ModelAndView("login", model.asMap());

//        return "index";
    }

}
