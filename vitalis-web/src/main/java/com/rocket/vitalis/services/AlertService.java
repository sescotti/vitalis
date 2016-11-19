package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.AlertNotificationDto;
import com.rocket.vitalis.dto.AlertRule;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.AlertNotificationRepository;
import com.rocket.vitalis.repositories.AlertRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

import static com.rocket.vitalis.model.NotificationStatus.OPEN;

/**
 * Created by Sony on 21/10/2016.
 */
@Service
@Log4j
public class AlertService {

    @Autowired  private AlertRepository                 alertRepository;

    @Autowired  private MonitoringRepository            monitoringRepository;

    @Autowired  private RulesService                    rulesService;

    @Autowired  private AlertNotificationRepository     alertNotificationRepository;

    public Collection<Alert> getMyAlerts(User user){
        return alertRepository.findByMonitoringPatient(user);
    }

    public Collection<Alert> getAlertsFollowing(User user){
        return alertRepository.findByCreatedBy(user);
    }

    public Alert addAlert(Long monitoringId, String measurementTypeName, Double from, Double to, User user){
        Monitoring monitoring = monitoringRepository.findOne(monitoringId);
        MeasurementType measurementType = MeasurementType.fromString(measurementTypeName);
        Alert alert = new Alert(measurementType, monitoring, user, from, to);
        alertRepository.save(alert);
        return alert;
    }

    public Alert modifyAlert(Long alertId, Long monitoringId, String measurementTypeName, Double from, Double to){
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


    public Collection<AlertRule> getDefaultRules(MeasurementType measurementType) {
        return rulesService.getDefaultRules(measurementType);
    }

    public AlertNotification createNotification(AlertNotification notification){
        return alertNotificationRepository.save(notification);
    }

    public Collection<AlertNotification> getOpenAlerts(Monitoring monitoring, MeasurementType measurementType){
        return alertNotificationRepository.findByMonitoringAndMeasurementTypeAndStatus(monitoring, measurementType, OPEN);
    }

    public Alert getAlert(Long alertId) {
        return alertRepository.findOne(alertId);
    }

    public Collection<AlertNotification> getNotifications(User user) {
        return alertNotificationRepository.findByOwnerOrderByCreationDateDesc(user);

    }

    public AlertNotification updateNotification(AlertNotificationDto notification) {
        AlertNotification alertNotification = alertNotificationRepository.findOne(notification.getId());
        alertNotification.setStatus(notification.getStatus());
        return alertNotificationRepository.save(alertNotification);
    }
}
