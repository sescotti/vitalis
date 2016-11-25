package com.rocket.vitalis.web.controller.api.access;

import com.rocket.vitalis.dto.AccessTokenValidationRequest;
import com.rocket.vitalis.exceptions.InvalidTokenException;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.dto.LoginRequest;
import com.rocket.vitalis.dto.PublicKey;
import com.rocket.vitalis.dto.SignupRequest;
import com.rocket.vitalis.exceptions.EmailAlreadyRegisteredException;
import com.rocket.vitalis.exceptions.InvalidLoginException;
import com.rocket.vitalis.model.AccessToken;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
/**
 * Created by sscotti on 8/15/16.
 */
@Log4j
@Controller
@RequestMapping("/api/access")
public class UserAccessApiController extends AbstractApiController {

    @Autowired
    private UserService userService;

    @RequestMapping(method = POST, value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, @RequestHeader(value = "X-Device-Token", required = false) String deviceToken){
        try {

            log.info("TOKEN : " + deviceToken);
            AccessToken accessToken = userService.login(request.getEmail(), request.getPassword());

            if(deviceToken != null && !"null".equals(deviceToken)){
                userService.registerDeviceToken(accessToken, deviceToken);
            }

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

    @RequestMapping(method = POST, value = "/logout", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> logout(@RequestHeader("X-Auth-Token") String accessToken){
        try {

            userService.logout(accessToken);
            return new ResponseEntity<>(OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = POST, value = "/validate", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> validate(@RequestBody AccessTokenValidationRequest request, @RequestHeader(value = "X-Device-Token", required = false) String deviceToken){
        try {

            userService.getUser(request.getAccessToken());

            return new ResponseEntity<>(OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (InvalidTokenException e) {
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
