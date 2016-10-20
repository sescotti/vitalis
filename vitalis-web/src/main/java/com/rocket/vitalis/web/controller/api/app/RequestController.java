package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.FollowingRequest;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.RequestRepository;
import com.rocket.vitalis.services.RequestService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.Collection;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by Ailin on 18/10/2016.
 */
@Controller
@RequestMapping(value ="/api/app/request", consumes = "application/json", produces = "application/json")
public class RequestController extends AbstractApiController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private RequestRepository requestRepository;


    @RequestMapping("/findUsers/{userName}")
    @ResponseBody
    public ResponseEntity<?> getUsersLike(@ModelAttribute("user") User user,
                                          @PathVariable("userName") String userName){
        Collection<SimpleMonitoring> monitorings = requestService.findMonitoringByUserName(user, userName);
        return new ResponseEntity<>(monitorings, OK);
    }

    @RequestMapping("/sentRequest")
    @ResponseBody
    public ResponseEntity<?> getSentRequest(@ModelAttribute("user") User user){
        Iterable<SimpleRequest> request = requestService.findSentRequest(user);
        return new ResponseEntity<>(request, OK);
    }

    @RequestMapping(method = POST, value = "/sendRequest", consumes = "application/json", produces = "application/json")
    public Object sendRequest(@ModelAttribute("user") User user,
                              @RequestBody FollowingRequest request){
        try {
            Monitoring monitoring = requestService.findMonitoring(request.getMonitoringId());

            /* Create new Request */
            Request requestFollowing = new Request(user, monitoring);
            return requestRepository.save(requestFollowing);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping("/myPendingRequest")
    @ResponseBody
    public ResponseEntity<?> getMyPendingRequest(@ModelAttribute("user") User user){
        Iterable<SimpleRequest> request = requestService.findMyPendingRequest(user);
        return new ResponseEntity<>(request, OK);
    }

    @RequestMapping("/pendingRequest")
    @ResponseBody
    public ResponseEntity<?> getPendingRequest(@ModelAttribute("user") User user){
        Iterable<SimpleRequest> request = requestService.findPendingRequest(user);
        return new ResponseEntity<>(request, OK);
    }
}

