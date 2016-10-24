package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.FollowingRequest;
import com.rocket.vitalis.dto.ModuleDto;
import com.rocket.vitalis.dto.ModuleRequest;
import com.rocket.vitalis.dto.MonitoringRequest;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.services.ModuleService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by Ailin on 20/10/2016.
 */
@Controller
@RequestMapping(value ="/api/app/modules")
public class ModuleController extends AbstractApiController {

    @Autowired
    private ModuleService moduleService;

    @RequestMapping("/")
    @ResponseBody
    public ResponseEntity<?> getModules(@ModelAttribute("user") User user){
        Collection<Module> modules = moduleService.findModules(user);

        List<ModuleDto> moduleDtos = modules.stream()
                                            .map(ModuleDto::new)
                                            .collect(toList());

        return new ResponseEntity<>(moduleDtos, OK);
    }

    @RequestMapping(method = POST, value = "/", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> addModule(@ModelAttribute("user") User user,
                              @RequestBody ModuleRequest request){
        try {
            Module module = moduleService.addModule(user, request.getModuleSerial());
            return new ResponseEntity<>(module, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = DELETE, value = "/{moduleId}",  produces = "application/json")
    public ResponseEntity<?> deleteModule(@ModelAttribute("user") User user,
                                          @PathVariable("moduleId") Long moduleId){
        try {
            Module module = moduleService.deleteModule(moduleId);
            return new ResponseEntity<>(module, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping(method = GET, value = "/{moduleId}")
    @ResponseBody
    public ResponseEntity<?> getModule(@ModelAttribute("user") User user, @PathVariable("moduleId") Long moduleId){
        Module module = moduleService.getModule(moduleId);
        return new ResponseEntity<>(module, OK);
    }



    @RequestMapping("/{moduleId}/monitorings")
    @ResponseBody
    public ResponseEntity<?> getMonitoring(@ModelAttribute("user") User user,
                                           @PathVariable("moduleId") Long moduleId){
        Monitoring monitoring = moduleService.getMonitoring(moduleId);
        return new ResponseEntity<>(monitoring, OK);
    }


    @RequestMapping(method = POST, value = "/{moduleId}/monitorings", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> initMonitoring(@ModelAttribute("user") User user,
                                            @PathVariable("moduleId") Long moduleId,
                                            @RequestBody MonitoringRequest request){
        try {
            MonitoringRequest.PatientDto patient = request.getPatient().iterator().next();
            Monitoring monitoring= moduleService.initMonitoring(moduleId, patient, request.getFollowers(), request.getSensors());
            return new ResponseEntity<>(monitoring, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }



}
