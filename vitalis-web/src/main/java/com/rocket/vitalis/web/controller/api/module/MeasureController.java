package com.rocket.vitalis.web.controller.api.module;

import com.rocket.vitalis.dto.MeasureRequest;
import com.rocket.vitalis.model.Measurement;
import com.rocket.vitalis.services.MeasureService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by sscotti on 8/11/16.
 */
@RestController
@RequestMapping(value = "/api/measures", consumes = "application/json", produces = "application/json")
@Log4j
public class MeasureController  extends AbstractApiController {

    @Autowired
    private MeasureService measureService;

    @RequestMapping(method = POST, value = "/measureup", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<?> measureUp(@RequestBody MeasureRequest request) {
        try{
            Measurement measurement = measureService.setMeasurement(request.getIdModule(),request.getMeasureDate(), request.getMeasureName(), request.getValue(), request.getValueSecondary());
            return new ResponseEntity<>(measurement, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("{\"error\": \"" + e.getMessage() + "\"}", BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"error\": \"internal_server_error\"}", INTERNAL_SERVER_ERROR);
        }
    }

}
