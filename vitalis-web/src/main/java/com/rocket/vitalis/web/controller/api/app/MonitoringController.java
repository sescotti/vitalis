package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.services.MonitoringService;
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

import java.util.Collection;

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
    private MonitoringService monitoringService;

    @Autowired
	private FollowerRepository followerRepository;

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

        Iterable<SimpleFollower> monitoredUser = followerRepository.findByUser(user);

        return new ResponseEntity<>(monitoredUser, OK);
    }
}
