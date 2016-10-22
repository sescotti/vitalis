package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by sscotti on 10/9/16.
 */
@RequestMapping("/api/app/user")
@Controller
public class UserController extends AbstractApiController{

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/profile", method = GET)
    @ResponseBody
    public ResponseEntity<?> getProfile(@ModelAttribute("user") User user){

        Profile profile = new Profile(user);
        return new ResponseEntity<Object>(profile, OK);
    }


    @RequestMapping("/search")
    @ResponseBody
    public ResponseEntity<?> getPatientsLikeWithOutMonitoring(@ModelAttribute("user") User user,
                                             @RequestParam("query") String query){
        Collection<User> users = userService.findPatientsLikeWithOutMonitoring(query);
        return new ResponseEntity<>(users, OK);
    }


}
