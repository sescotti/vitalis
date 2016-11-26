package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.services.MonitoringService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.springframework.http.HttpStatus.*;

/**
 * Created by sscotti on 10/1/16.
 */
@Controller
@RequestMapping("/api/app/home")
public class HomeController extends AbstractApiController {

    @Autowired  private MonitoringService       monitoringService;
    @Autowired  private MonitoringRepository    monitoringRepository;

    @RequestMapping("/index")
    @ResponseBody
    public ResponseEntity<?> index(){
        Long userId = 0L;

        return null;
    }

    @RequestMapping("/mystatus")
    @ResponseBody
    public ResponseEntity<?> getProfile(@ModelAttribute("user") User user){

        try {

            Monitoring monitoring = monitoringService.findActiveMonitoringByUser(user);

            List<Monitoring> monitorings = monitoring != null ? asList(monitoring) : Collections.<Monitoring>emptyList();

            // Devuelvo como una lista para poder reutilizar vistas
            return new ResponseEntity<>(monitorings, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }

    }

    @RequestMapping("/following")
    @ResponseBody
    public ResponseEntity<?> getFollowing(@ModelAttribute("user") User user,
                                          @RequestParam(value = "include_myself", required = false) boolean includeMyself
                                          ){

        try {

            Collection<SimpleFollower> activeMonitoringsFollowedByUser = monitoringService.findActiveMonitoringsFollowedByUser(user);

            List<SimpleMonitoring> monitorings = activeMonitoringsFollowedByUser
                                                                .stream()
                                                                .map(SimpleFollower::getMonitoring)
                                                                .collect(toList());

            if(includeMyself){

                Optional<SimpleMonitoring> first = monitorings.stream().filter(simpleMonitoring -> user.getId().equals(simpleMonitoring.getPatient().getId())).findFirst();

                if(!first.isPresent()){

                    Monitoring activeMonitoringByUser = monitoringService.findActiveMonitoringByUser(user);

                    if(activeMonitoringByUser != null){

                        SimpleUser simpleUser = new SimpleUser() {
                            public Long getId() { return user.getId(); }
                            public UserType getUserType() { return user.getUserType(); }
                            public String getName() { return user.getName(); }
                            public String getPictureUrl() { return user.getPictureUrl(); }
                        };

                        SimpleMonitoring simpleMonitoring = new SimpleMonitoring() {
                            @Override
                            public Long getId() {
                                return activeMonitoringByUser.getId();
                            }

                            @Override
                            public SimpleUser getPatient() {
                                return simpleUser;
                            }
                        };

                        monitorings.add(simpleMonitoring);

                    }
                }
            }

            return new ResponseEntity<>(monitorings, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }

    }

}
