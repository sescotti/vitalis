package com.rocket.vitalis.services;

import com.rocket.vitalis.model.Measurement;
import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.repositories.MeasurementRepository;
import com.rocket.vitalis.repositories.ModuleRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.DoubleSummaryStatistics;

import static com.rocket.vitalis.model.MeasurementType.BLOOD_PRESSURE;

/**
 * Created by Ailin on 23/10/2016.
 */
@Service
@Log4j
public class MeasureService {
    @Autowired
    private MeasurementRepository measurementRepository;
    @Autowired
    private MonitoringRepository monitoringRepository;
    @Autowired
    private ModuleRepository moduleRepository;


    public Measurement setMeasurement(Long moduleId, String measureDateString, MeasurementType measurementType, Double value, Double valueSecondary){
          /* Get MODULE */
        Module module = moduleRepository.findOne(moduleId);

        /* Get Last MONITORING  from MODULE */
        Monitoring monitoring = monitoringRepository.findByModuleAndFinishDateIsNull(module);

        /* Get Date from string */
        Date measureDate = null;
        try {
            String dateS = measureDateString;
            measureDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse(dateS);
        } catch (ParseException e) {
            measureDate = new Date();
        }

        /* Create new MEASURE */
        Measurement measure;
        if (BLOOD_PRESSURE.equals(measurementType))
            measure = new Measurement(monitoring,measureDate,measurementType, value, valueSecondary);
        else
            measure = new Measurement(monitoring,measureDate,measurementType, value);

        measurementRepository.save(measure);
        return  measure;
    }
}
