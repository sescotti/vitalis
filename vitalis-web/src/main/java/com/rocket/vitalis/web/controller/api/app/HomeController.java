package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.SimpleFollower;
import com.rocket.vitalis.model.SimpleMonitoring;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;
import static org.springframework.http.HttpStatus.*;

/**
 * Created by sscotti on 10/1/16.
 */
@Controller
@RequestMapping("/api/app/home")
public class HomeController extends AbstractApiController {

    @Autowired  private FollowerRepository      followerRepository;
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

            Monitoring monitoring = monitoringRepository.findByPatientIdAndFinishDateIsNull(user.getId());

            // Devuelvo como una lista para poder reutilizar vistas
            return new ResponseEntity<>(asList(monitoring), OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }

    }

    @RequestMapping("/following")
    @ResponseBody
    public ResponseEntity<?> getFollowing(@ModelAttribute("user") User user){

        try {

            List<SimpleMonitoring> monitorings = followerRepository   .findByUser(user)
                                                                .stream()
                                                                .map(SimpleFollower::getMonitoring)
                                                                .collect(toList());


            return new ResponseEntity<>(monitorings, OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }

    }

}
