package com.rocket.vitalis.web.controller.api.app;

import com.google.common.collect.Iterables;
import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.model.Follower;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.http.HttpStatus.OK;

/**
 * Created by sscotti on 10/10/16.
 */
@Controller
@RequestMapping("/api/app/monitoring")
public class MonitoringController extends AbstractApiController {

    @Autowired
    private UserService userService;
    @Autowired
    private FollowerRepository followerRepository;

    @RequestMapping("/patientstatus/{monitoringId}")
    @ResponseBody
    public ResponseEntity<?> getPatientStatus(@ModelAttribute("user") User user,
                                              @PathVariable("monitoringId") Long monitoringId){

        Profile monitoredUser = new Profile(userService.getUser(monitoringId));

        return new ResponseEntity<>(monitoredUser, OK);
    }

    @RequestMapping("/patientstatus")
    @ResponseBody
    public ResponseEntity<?> getPatientsStatus(@ModelAttribute("user") User user){

        Iterable<Follower> monitoredUser = followerRepository.findByUser(user);

        return new ResponseEntity<>(monitoredUser, OK);
    }
}
