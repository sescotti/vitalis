package com.rocket.vitalis.web.controller.web;

import com.rocket.vitalis.utils.FileUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static com.rocket.vitalis.utils.FileUtils.readJson;
import static java.util.Arrays.asList;

@Controller
@RequestMapping
public class SinglePageApplicationController {

    @Autowired
    private Environment environment;

    private String assetsHost;

    private ResourcesHolder holder;

    @RequestMapping(value={"/", "", "/login", "/signup", "/app", "/app/","/app/**"})
    public ModelAndView index(Model model) {

        List<String> profiles = asList(environment.getActiveProfiles());
        boolean isProd = profiles.contains("prod");

        model.addAttribute("is_prod", isProd);
//        model.addAttribute("is_prod", true);
        model.addAttribute("resources", holder);

        return new ModelAndView("index", model.asMap());

    }

    @PostConstruct
    public void postConstruct() throws IOException {
//        Map<String, String> bundles = readJson("/static/ui-dist/rev-manifest.json");

//        String cssBundle = bundles.get("bundle__large.css");
//        String jsBundle = bundles.get("bundle__large.js");
//        String jsCore = bundles.get("core__large.js");

        String cssBundle    = "bundle__large.css";
        String jsBundle     = "bundle__large.js";
        String jsCore       = "core__large.js";

        String[] activeProfiles = environment.getActiveProfiles();

        assetsHost = "";

        for (String profile : activeProfiles) {
            if ("dev".equals(profile)) {
                assetsHost = "//localhost:3000";
            } else if ("prod".equals(profile)) {
                assetsHost = "";
            }
        }

        this.holder = new ResourcesHolder(assetsHost, cssBundle, jsBundle, jsCore);
    }

    @Data
    @AllArgsConstructor
    public static class ResourcesHolder {
        private String assetsHost;
        private String cssBundle;
        private String jsBundle;
        private String jsCore;
    }

}
