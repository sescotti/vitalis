package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.AdminFollowerRequest;
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

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

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

    @RequestMapping("/{monitoringId}/users/search")
    @ResponseBody
    public ResponseEntity<?> getUsersLike(@ModelAttribute("user") User user,
                                          @PathVariable("monitoringId") Long monitoringId,
                                          @RequestParam("query") String query){
        Collection<User> users = monitoringService.findUsersLikeNotFollowers(monitoringId, query);
        return new ResponseEntity<>(users, OK);
    }

    @RequestMapping("/{monitoringId}/followers")
    @ResponseBody
    public ResponseEntity<?> getFollowers(@ModelAttribute("user") User user,
                                          @PathVariable("monitoringId") Long monitoringId){
        Collection<Follower> followers = monitoringService.getFollowers(monitoringId);
        return new ResponseEntity<>(followers, OK);
    }

    @RequestMapping(method = POST, value = "/{monitoringId}/addFollower/{UserId}", produces = "application/json")
    public ResponseEntity<?> addFollower(@ModelAttribute("user") User user,
                                            @PathVariable("monitoringId") Long monitoringId,
                                            @PathVariable("followerId") Long followerId){
        try {
            Follower follower= monitoringService.addFollower(monitoringId, followerId);
            return new ResponseEntity<>(follower, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = POST, value = "/{monitoringId}/modifyFollower/{followerId}", produces = "application/json")
    public ResponseEntity<?> modifyFollower(@ModelAttribute("user") User user,
                                            @PathVariable("monitoringId") Long monitoringId,
                                            @PathVariable("followerId") Long followerId,
                                            @RequestBody AdminFollowerRequest request){
        try {
            Follower follower= monitoringService.modifyFollower(followerId, request.getIsAdmin());
            return new ResponseEntity<>(follower, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = POST, value = "/{monitoringId}/deleteFollower/{followerId}", produces = "application/json")
    public ResponseEntity<?> deleteFollower(@ModelAttribute("user") User user,
                                            @PathVariable("monitoringId") Long monitoringId,
                                            @PathVariable("followerId") Long followerId){
        try {
            Follower follower= monitoringService.deleteFollower(followerId);
            return new ResponseEntity<>(follower, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = POST, value = "/{monitoringId}/finishMonitoring", produces = "application/json")
    public ResponseEntity<?> finishMonitoring(@ModelAttribute("user") User user,
                                              @PathVariable("monitoringId") Long monitoringId){
        try {
            Monitoring monitoring= monitoringService.finishMonitoring(monitoringId);
            return new ResponseEntity<>(monitoring, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }


}
