package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.FollowingRequest;
import com.rocket.vitalis.dto.PublicKey;
import com.rocket.vitalis.exceptions.InvalidLoginException;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.model.Request;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.repositories.RequestRepository;
import com.rocket.vitalis.repositories.UserRepository;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by Ailin on 18/10/2016.
 */
@Controller
@RequestMapping(value ="/api/app/request", consumes = "application/json", produces = "application/json")
public class RequestController extends AbstractApiController {

    @Autowired
    private MonitoringRepository monitoringRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;


    @RequestMapping("/findUsers/{userName}")
    @ResponseBody
    public ResponseEntity<?> getUsersLike(@ModelAttribute("user") User user,
                                          @PathVariable("userName") String userName){

        Iterable<Monitoring> monitorig = monitoringRepository.findByPatientNameStartingWithIgnoreCaseAndFinishDateIsNull(userName);

        return new ResponseEntity<>(monitorig, OK);
    }

    @RequestMapping("/pendingRequest")
    @ResponseBody
    public ResponseEntity<?> getPendingRequest(@ModelAttribute("user") User user){

        Iterable<Request> request = requestRepository.findByRequestedBy(user);
        return new ResponseEntity<>(request, OK);
    }

    @RequestMapping(method = POST, value = "/sendRequest", consumes = "application/json", produces = "application/json")
    public Object sendRequest(@ModelAttribute("user") User user,
                              @RequestBody FollowingRequest request){
        try {
            Monitoring monitoring = monitoringRepository.findById(request.getMonitoringId());

            /* Create new Request */
            Request requestFollowing = new Request(user, monitoring);
            return requestRepository.save(requestFollowing);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }
}

