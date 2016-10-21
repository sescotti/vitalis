package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.services.MonitoringService;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
//        MonitoringDto monitoring = monitoringService.findById(monitoringId);
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

    @RequestMapping("/search")
    @ResponseBody
    public ResponseEntity<?> getUsersLike(@ModelAttribute("user") User user,
                                          @RequestParam("query") String query){
        Collection<SimpleMonitoring> monitorings = monitoringService.findMonitoringByUserName(user, query);
        return new ResponseEntity<>(monitorings, OK);
    }

}
