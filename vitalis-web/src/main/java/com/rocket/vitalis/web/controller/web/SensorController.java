package com.rocket.vitalis.web.controller.web;

import com.rocket.vitalis.model.Measurement;
import com.rocket.vitalis.repositories.MeasurementRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Ailin on 25/08/2016.
 */
@Controller
@RequestMapping({"/sensor"})
@Log4j
public class SensorController {
    @Autowired
    private MeasurementRepository measurementRepository;


    @RequestMapping(value={"", "/"})
    public String index(Model model) {
        Measurement measurement = measurementRepository.findOne(Long.parseLong("1"));
        Double value = measurement.getValue();
        System.out.println(value);
        model.addAttribute("value", value);
        return "sensor";
    }

}
