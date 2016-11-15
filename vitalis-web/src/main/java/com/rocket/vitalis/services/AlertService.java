package com.rocket.vitalis.services;

import com.rocket.vitalis.model.Alert;
import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.AlertRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

/**
 * Created by Sony on 21/10/2016.
 */
@Service
@Log4j
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private MonitoringRepository monitoringRepository;

    public Collection<Alert> getMyAlerts(User user){
        Collection<Alert> alerts = alertRepository.findByMonitoringPatient(user);
        return alerts;
    }

    public Collection<Alert> getAlertsFollowing(User user){
        Collection<Alert> alerts = alertRepository.findByCreatedBy(user);
        return alerts;
    }

    public Alert addAlert(Long monitoringId, String measurementTypeName, Double from, Double to, User user){
        Monitoring monitoring = monitoringRepository.findOne(monitoringId);
        MeasurementType measurementType = MeasurementType.fromString(measurementTypeName);
        Alert alert = new Alert(measurementType, monitoring, user, from, to);
        alertRepository.save(alert);
        return alert;
    }

    public Alert modifyAlert(Long alertId, Long monitoringId, String measurementTypeName, Double from, Double to, User user){
        Alert alert = alertRepository.findOne(alertId);
        Monitoring monitoring = monitoringRepository.findOne(monitoringId);
        alert.setMonitoring(monitoring);
        MeasurementType measurementType = MeasurementType.fromString(measurementTypeName);
        alert.setMeasurementType(measurementType);
        alert.setFrom(from);
        alert.setTo(to);
        alertRepository.save(alert);
        return alert;
    }

    public Alert deleteAlert(Long alertId){
        Alert alert = alertRepository.findOne(alertId);
        alertRepository.delete(alert);
        return alert;
    }

    public Collection<Alert> getAlertsFor(Monitoring monitoring, MeasurementType measurementType){
        return alertRepository.findByMonitoringAndMeasurementType(monitoring, measurementType);
    }


}
