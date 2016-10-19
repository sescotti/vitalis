package com.rocket.vitalis.services;

import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.MeasurementRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

import static org.springframework.data.domain.Sort.Direction.DESC;

/**
 * Created by sscotti on 10/17/16.
 */
@Service
@Log4j
public class MonitoringService {

    private static final int PAGE_SIZE = 15;
    @Autowired private MonitoringRepository monitoringRepository;
    @Autowired private MeasurementRepository measurementRepository;

    @Transactional
    public Monitoring findById(Long id){
        Monitoring monitoring = monitoringRepository.findById(id);
//        Collection<Sensor> sensors = monitoring.getSensors();
//        log.debug(sensors);
        return monitoring;
    }

    @Transactional
    public Collection<SimpleMeasurement> findMeasurements(Long monitoringId, MeasurementType type){

        Page<SimpleMeasurement> measurements;
        measurements = measurementRepository.findByMonitoringIdAndType(monitoringId, type, new PageRequest(0, PAGE_SIZE, DESC, "measurementDate"));

        return measurements.getContent();
    }

    public Collection<SimpleMeasurement> findMeasurements(Long monitoringId, MeasurementType type, int pageNumber){

        Page<SimpleMeasurement> measurements = measurementRepository.findByMonitoringIdAndType(monitoringId, type, new PageRequest(0, PAGE_SIZE, DESC, "measurementDate"));

        return measurements.getContent();
    }

}
