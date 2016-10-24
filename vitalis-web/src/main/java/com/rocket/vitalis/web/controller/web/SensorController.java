package com.rocket.vitalis.web.controller.web;

import com.rocket.vitalis.model.Measurement;
import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.repositories.MeasurementRepository;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.rocket.vitalis.model.MeasurementType.values;
import static java.util.Arrays.asList;
import static org.springframework.http.HttpStatus.OK;

/**
 * Created by Ailin on 25/08/2016.
 */
@Controller
@RequestMapping({"/api/app/sensors"})
@Log4j
public class SensorController {

    @RequestMapping(value={"", "/"})
    public ResponseEntity<?> getAvailableSensors() {

        List<SensorDto> sensors = new ArrayList<>(values().length);

        for(MeasurementType type : values()){
            sensors.add(new SensorDto(type));
        }
        return new ResponseEntity<>(sensors, OK);
    }

    @Data
    @RequiredArgsConstructor
    private static class SensorDto {
        @NonNull
        private MeasurementType type;
    }

}
