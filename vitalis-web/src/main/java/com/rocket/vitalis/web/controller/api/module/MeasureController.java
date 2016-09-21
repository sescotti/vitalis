package com.rocket.vitalis.web.controller.api.module;

import com.rocket.vitalis.dto.MeasureRequest;
import com.rocket.vitalis.repositories.MeasurementRepository;
import com.rocket.vitalis.repositories.ModuleRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.model.Measurement;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.model.Module;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Date;
import java.text.SimpleDateFormat;

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
    @Autowired
    private MonitoringRepository monitoringRepository;
    @Autowired
    private ModuleRepository moduleRepository;

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
        Module module = moduleRepository.findOne(request.getIdModule());
        Monitoring monitoring = monitoringRepository.findByModule(module);
        MeasurementType measurementType = MeasurementType.fromString(request.getMeasureName());

        Date measureDate = null;
        try {
            String dateS = request.getMeasureDate();
            measureDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse(dateS);
        } catch (ParseException e) {
            measureDate = new Date();
        }

        Measurement measure = new Measurement(monitoring,measureDate,measurementType, request.getValue());
        return measurementRepository.save(measure);
    }

}
