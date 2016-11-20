package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.dto.UserData;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by sscotti on 10/9/16.
 */
@RequestMapping("/api/app/users")
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
    public ResponseEntity<?> searchPatientsWithoutMonitoring(
                                            @ModelAttribute("user") User user,
                                            @RequestParam("query") String query,
                                            @RequestParam(value = "exclude_with_monitoring", required = false) boolean excludeWithMonitoring
                                                             ){
        Collection<User> users;
        if(excludeWithMonitoring){
            users = userService.searchPatientsWithoutMonitoring(query);
        } else {
            users = userService.searchPatients(query);
        }

        return new ResponseEntity<>(users, OK);
    }

    @RequestMapping(value = "/profile", method = { PUT, POST })
    @ResponseBody
    public ResponseEntity<?> save(@ModelAttribute("user") User user,
                                  @RequestBody UserData formUserData) {
        user.setName(formUserData.getName());
        user.setDocNumber(formUserData.getDocNumber());
        user.setDocumentType(formUserData.getDocumentType());
        user.setBloodFactor(formUserData.getBloodFactor());
        user.setBloodType(formUserData.getBloodType());
        user.setIsDoctor(formUserData.isDoctor());
        user = userService.save(user);

        return new ResponseEntity<Object>(user, OK);
    }

    @RequestMapping(value = "/{userId}", method = { PUT, POST })
    @ResponseBody
    public ResponseEntity<?> save(@ModelAttribute("user") User thisUser,
                                  @PathVariable("userId") Long userId,
                                  @RequestBody UserData formUserData) {

        User user = userService.getUser(userId);

        user.setName(formUserData.getName());
        user.setDocNumber(formUserData.getDocNumber());
        user.setDocumentType(formUserData.getDocumentType());
        user.setBloodFactor(formUserData.getBloodFactor());
        user.setBloodType(formUserData.getBloodType());
        user.setIsDoctor(formUserData.isDoctor());
        user = userService.save(user);

        return new ResponseEntity<Object>(user, OK);
    }

}
