package com.rocket.vitalis.web.controller.api.app;

import static org.springframework.http.HttpStatus.OK;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.rocket.vitalis.model.Follower;
import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.SimpleMeasurement;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.services.MonitoringService;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;

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

    @Autowired
    private MonitoringService monitoringService;

    @RequestMapping("/patientstatus/{monitoringId}")
    @ResponseBody
    public ResponseEntity<?> getPatientStatus(@ModelAttribute("user") User user,
                                              @PathVariable("monitoringId") Long monitoringId){
        Monitoring monitoring = monitoringService.findById(monitoringId);

        return new ResponseEntity<>(monitoring, OK);
    }

    @RequestMapping("/patientstatus/{monitoringId}/sensors/{measurementType}")
    @ResponseBody
    public ResponseEntity<?> getMeasurements(@ModelAttribute("user") User user,
                                              @PathVariable("monitoringId") Long monitoringId,
                                              @PathVariable("measurementType") MeasurementType type){

        Collection<SimpleMeasurement> measurements = monitoringService.findMeasurements(monitoringId, type);

        return new ResponseEntity<>(measurements, OK);
    }

    @RequestMapping("/patientstatus")
    @ResponseBody
    public ResponseEntity<?> getPatientsStatus(@ModelAttribute("user") User user){

        Iterable<Follower> monitoredUser = followerRepository.findByUser(user);

        return new ResponseEntity<>(monitoredUser, OK);
    }
}
