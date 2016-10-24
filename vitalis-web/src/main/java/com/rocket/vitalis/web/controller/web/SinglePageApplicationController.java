package com.rocket.vitalis.web.controller.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;

@Controller
@RequestMapping
public class SinglePageApplicationController {

    @Autowired
    private Environment environment;

    private String assetsHost;

    @RequestMapping(value={"/", "", "/login", "/signup", "/app", "/app/","/app/**"})
    public ModelAndView index(Model model) {

        model.addAttribute("title", "Un subtitulo home");

        model.addAttribute("assets_host", assetsHost);

        return new ModelAndView("index", model.asMap());

//        return "index";
    }

    @PostConstruct
    public void postConstruct(){
        String[] activeProfiles = environment.getActiveProfiles();

        assetsHost = "//localhost:3000";

        for (String profile : activeProfiles) {
            if ("dev".equals(profile)) {
                assetsHost = "//localhost:3000";
            } else if ("prod".equals(profile)) {
                assetsHost = "/";
            }
        }
    }

}
