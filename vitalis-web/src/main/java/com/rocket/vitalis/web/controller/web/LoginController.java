package com.rocket.vitalis.web.controller.web;

import com.rocket.vitalis.dto.LoginRequest;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by sscotti on 8/9/16.
 */
@Controller
@RequestMapping({"/login"})
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping({"/"})
    public ModelAndView index(Model model) {

        model.addAttribute("title", "Un subtitulo");
        return new ModelAndView("login", model.asMap());

//        return "index";
    }

    @RequestMapping(method = GET, value = "/login", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public Object login(@RequestBody LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail());
        if(user != null){
            Map<String, Object> model = new HashMap<>();
            model.put("user", user);
            return new ModelAndView("login", model);
        } else {
            return "redirect:/home";
        }
    }
    @RequestMapping(method = POST, value = "/signup", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public Object signup(@RequestBody LoginRequest request) {
        User user = new User(request.getUsername(), request.getEmail(), request.getPassword());
        user = userRepository.save(user);
        if (user != null) {
            Map<String, Object> model = new HashMap<>();
            model.put("user", user);
            return new ModelAndView("login", model);
        } else {
            return "redirect:/home";
        }
    }

}
