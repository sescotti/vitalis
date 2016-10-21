package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.FollowerRequest;
import com.rocket.vitalis.dto.FollowingRequest;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.repositories.RequestRepository;
import com.rocket.vitalis.services.RequestService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

import static com.rocket.vitalis.model.RequestStatus.REJECTED;
import static com.rocket.vitalis.model.RequestStatus.ACCEPTED;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by Ailin on 18/10/2016.
 */
@Controller
@RequestMapping(value ="/api/app/request", produces = "application/json")
public class RequestController extends AbstractApiController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private FollowerRepository followerRepository;

    @RequestMapping("/sentRequest")
    @ResponseBody
    public ResponseEntity<?> getSentRequest(@ModelAttribute("user") User user){
        Iterable<SimpleRequest> request = requestService.findSentRequest(user);
        return new ResponseEntity<>(request, OK);
    }

    @RequestMapping(method = POST, value = "/", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> sendRequest(@ModelAttribute("user") User user,
                              @RequestBody FollowingRequest request){
        try {
            Monitoring monitoring = requestService.findMonitoring(request.getMonitoringId());

            /* Create new Request */
            Request requestFollowing = new Request(user, monitoring);
            requestRepository.save(requestFollowing);

            return new ResponseEntity<Object>(requestFollowing, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping("/myPendingRequests")
    @ResponseBody
    public ResponseEntity<?> getMyPendingRequest(@ModelAttribute("user") User user){
        Iterable<SimpleRequest> request = requestService.findMyPendingRequest(user);
        return new ResponseEntity<>(request, OK);
    }

    @RequestMapping("/otherPendingRequests")
    @ResponseBody
    public ResponseEntity<?> getPendingRequest(@ModelAttribute("user") User user){
        Iterable<SimpleRequest> request = requestService.findPendingRequest(user);
        return new ResponseEntity<>(request, OK);
    }


    @RequestMapping(method = PUT, value = {"/myPendingRequests/{followRequestId}", "/otherPendingRequests/{followRequestId}"}, consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> solveRequest(@ModelAttribute("user") User user, @PathVariable("followRequestId") Long followRequestId, @RequestBody FollowerRequest followerRequest){
        try {
            Boolean isAccepted = ACCEPTED.equals(followerRequest.getStatus());
            Request modifyRequest = requestService.findRequest(followRequestId);

            modifyRequest.setRequestStatus(followerRequest.getStatus());

            if (isAccepted){
                /* Seteo el Estado del Request en ACEPTADO */

                /*Guardo en Follower*/
                Follower newFollower =  new Follower(modifyRequest.getRequestedBy(), modifyRequest.getMonitoring());
                followerRepository.save(newFollower);
            }

            Request request = requestRepository.save(modifyRequest);

            return new ResponseEntity<>(request, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }


}

