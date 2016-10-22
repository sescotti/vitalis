package com.rocket.vitalis.web.controller.api.app;


import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by Sony on 22/10/2016.
 */
@Controller
@RequestMapping(value ="/api/app/doctor")
public class DoctorController {

    @Autowired
    private UserService userService;

    @RequestMapping(method = POST, value = "/{userId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> addModule(@ModelAttribute("user") User user,
                                       @PathVariable("userId") Long userId){
        try {
            User userD = userService.setDoctor(userId);
            return new ResponseEntity<>(userD, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

}
