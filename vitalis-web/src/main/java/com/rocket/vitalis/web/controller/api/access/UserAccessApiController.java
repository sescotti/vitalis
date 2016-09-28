package com.rocket.vitalis.web.controller.api.access;

import com.rocket.vitalis.dto.LoginRequest;
import com.rocket.vitalis.exceptions.UserNotFoundException;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.UserRepository;
import com.rocket.vitalis.utils.PasswordStorage;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import static com.rocket.vitalis.utils.PasswordStorage.*;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.apache.commons.lang3.StringUtils.isBlank;
/**
 * Created by sscotti on 8/15/16.
 */
@Log4j
@Controller
@RequestMapping("/api/access")
public class UserAccessApiController {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(method = POST, value = "/login", consumes = "application/json", produces = "application/json")
    public Object login(@RequestBody LoginRequest request){
        try {
            assertRequestIsValid(request);
            User user = userRepository.findByEmail(request.getEmail());
            String pass = user == null ? "" : user.getPassword();
            verifyPassword(request.getPassword(), pass);

            return new ResponseEntity<>(user, OK);
        } catch (PasswordStorage.CannotPerformOperationException e) {
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        } catch (InvalidHashException e) {
            return new ResponseEntity<>("{\"error\": \"invalid_credentials\"}", UNAUTHORIZED);
        } catch (IllegalArgumentException e){
            return new ResponseEntity<>("{\"error\": \""+ e.getMessage() +"\"}", BAD_REQUEST);
        } catch (Exception e){
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = POST, value = "/signup", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<User> signup(@RequestBody LoginRequest request) {
        try {
            String hash = createHash(request.getPassword());

            User user = new User(request.getEmail(), hash);

            return new ResponseEntity<>(userRepository.save(user), OK);

        } catch (PasswordStorage.CannotPerformOperationException e) {
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
    }

    private void assertRequestIsValid(LoginRequest request) {
        if(isBlank(request.getEmail()) || isBlank(request.getPassword())){
            throw new IllegalArgumentException("incomplete_credentials");
        }
    }

}
