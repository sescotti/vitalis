package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.AlertRequest;
import com.rocket.vitalis.dto.DeviceTokenRequest;
import com.rocket.vitalis.model.Alert;
import com.rocket.vitalis.model.DeviceToken;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.DeviceTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by sscotti on 11/16/16.
 */
@Controller
@RequestMapping(value ="/api/app/devicetokens")
public class DeviceTokenController {

    @Autowired
    private DeviceTokenRepository deviceTokenRepository;

    @RequestMapping(method = POST, value = "/", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> addModule(@ModelAttribute("user") User user,
                                       @RequestBody DeviceTokenRequest request){
        try {

//            DeviceToken deviceToken = new DeviceToken(user, request.getToken());
//            deviceToken = deviceTokenRepository.save(deviceToken);
//            return new ResponseEntity<>(deviceToken, OK);
            return new ResponseEntity<>(null, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }


}
