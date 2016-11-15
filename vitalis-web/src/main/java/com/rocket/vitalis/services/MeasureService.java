package com.rocket.vitalis.services;

import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.MeasurementRepository;
import com.rocket.vitalis.repositories.ModuleRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.repositories.SensorRepository;
import lombok.extern.log4j.Log4j;
import org.joda.time.DateTime;
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
    @Autowired
    private SensorRepository sensorRepository;

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

        Date dateLimit = new DateTime().minusDays(10).toDate();
        if(measureDate.before(dateLimit)){
            measureDate = new Date();
        }

        for(Sensor sensor : monitoring.getSensors()){
            if(sensor.getMeasurementType().equals(measurementType)){
                sensor.setLastValue(value);
                sensor.setLastValueSecondary(valueSecondary);
                sensor.setLastMonitoringDate(measureDate);
                sensorRepository.save(sensor);
                break;
            }
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
