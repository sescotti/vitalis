package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.AlertRequest;
import com.rocket.vitalis.dto.ModuleRequest;
import com.rocket.vitalis.model.Alert;
import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.AlertService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by Ailin on 21/10/2016.
 */
@Controller
@RequestMapping(value ="/api/app/alerts")
public class AlertController  extends AbstractApiController {

    @Autowired
    private AlertService alertService;

    @RequestMapping("/")
    @ResponseBody
    public ResponseEntity<?> getMyAlerts(@ModelAttribute("user") User user){
        Collection<Alert> alerts = alertService.getAlertsFollowing(user);
        return new ResponseEntity<>(alerts, OK);
    }

    @RequestMapping("/following")
    @ResponseBody
    public ResponseEntity<?> getAlerts(@ModelAttribute("user") User user){
        Collection<Alert> alerts = alertService.getAlertsFollowing(user);
        return new ResponseEntity<>(alerts, OK);
    }

    @RequestMapping(method = POST, value = "/", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> addAlert(@ModelAttribute("user") User user,
                                       @RequestBody AlertRequest request){
        try {
            Alert alert = alertService.addAlert(request.getMonitoringId(), request.getMeasurementType(), request.getFrom(), request.getTo(), user);
            return new ResponseEntity<>(alert, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = PUT, value = "/{alertId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> update (   @ModelAttribute("user") User user,
                                        @PathVariable("alertId") Long alertId,
                                        @RequestBody AlertRequest request){
        try {
            Alert alert = alertService.modifyAlert(alertId, request.getMonitoringId(), request.getMeasurementType(), request.getFrom(), request.getTo());
            return new ResponseEntity<>(alert, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = DELETE, value = "/{alertId}", produces = "application/json")
    public ResponseEntity<?> delete(@ModelAttribute("user") User user,
                                       @PathVariable("alertId") Long alertId){
        try {
            Alert alert = alertService.deleteAlert(alertId);
            return new ResponseEntity<>(alert, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = GET, value = "/{alertId}", produces = "application/json")
    public ResponseEntity<?> getAlert(@ModelAttribute("user") User user,
                                    @PathVariable("alertId") Long alertId){
        try {
            Alert alert = alertService.getAlert(alertId);
            return new ResponseEntity<>(alert, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }
}
