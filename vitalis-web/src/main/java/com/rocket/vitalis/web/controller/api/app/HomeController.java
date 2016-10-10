package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

/**
 * Created by sscotti on 10/1/16.
 */
@Controller
@RequestMapping("/api/app/home")
public class HomeController extends AbstractApiController {

    @Autowired
    private UserService userService;

    @RequestMapping("/index")
    @ResponseBody
    public ResponseEntity<?> index(){
        Long userId = 0L;

        return null;
    }

    @RequestMapping("/mystatus")
    @ResponseBody
    public ResponseEntity<?> getProfile(@ModelAttribute("user") User user){

        try {
            Profile profile = new Profile(user);

            return new ResponseEntity<>(profile, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }

    }

    @RequestMapping("/following")
    @ResponseBody
    public ResponseEntity<?> getFollowing(@ModelAttribute("user") User user){

        try {

            Collection<Profile> profiles = user.getFollowing()  .stream()
                                                                .map(Profile::new)
                                                                .collect(Collectors.toList());

            return new ResponseEntity<>(profiles, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }

    }

}
