package com.rocket.vitalis.web.controller.api.module;

import com.rocket.vitalis.dto.MeasureRequest;
import com.rocket.vitalis.repositories.MeasurementRepository;
import com.rocket.vitalis.model.Measurement;
import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.User;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

import static java.time.Instant.now;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by sscotti on 8/11/16.
 */
@RestController
@RequestMapping(value = "/api/measures", consumes = "application/json", produces = "application/json")
@Log4j
public class MeasureController {
    @Autowired
    private MeasurementRepository measurementRepository;

    @RequestMapping(value = "/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public Object postMeasure(@PathVariable("userId") Long userId, @RequestBody MeasureRequest request){
        log.info("Received + " + request);

        User user = new User("sebastian@vitalis.com", "sarasapass");
        user.setId(1000L);

        return user;
    }


    @RequestMapping(method = POST, value = "/measureup", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public Object measureUp(@RequestBody MeasureRequest request) {
        Measurement measure = new Measurement(request.getMeasureName(), request.getValue());
        return measurementRepository.save(measure);
    }

}
