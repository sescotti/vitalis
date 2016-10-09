package com.rocket.vitalis.web.controller.api.access;

import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.dto.LoginRequest;
import com.rocket.vitalis.dto.PublicKey;
import com.rocket.vitalis.dto.SignupRequest;
import com.rocket.vitalis.exceptions.EmailAlreadyRegisteredException;
import com.rocket.vitalis.exceptions.InvalidLoginException;
import com.rocket.vitalis.model.AccessToken;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
/**
 * Created by sscotti on 8/15/16.
 */
@Log4j
@Controller
@RequestMapping("/api/access")
public class UserAccessApiController {

    @Autowired
    private UserService userService;

    @RequestMapping(method = POST, value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try {

            AccessToken accessToken = userService.login(request.getEmail(), request.getPassword());
            PublicKey publicKey = new PublicKey(accessToken.getToken());
            return new ResponseEntity<>(publicKey, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (InvalidLoginException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = POST, value = "/signup", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {

            userService.signup(request);
            return new ResponseEntity<>("{\"result\": \"user_created\"}",OK);

        } catch (IllegalArgumentException e){
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (EmailAlreadyRegisteredException e){
            return new ResponseEntity<>("{\"error\": \"email_already_registered\"}", CONFLICT);
        }
    }

}
