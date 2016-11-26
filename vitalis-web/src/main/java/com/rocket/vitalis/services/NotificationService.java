package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.AlertRule;
import com.rocket.vitalis.dto.google.PushNotificationDto;
import com.rocket.vitalis.dto.google.PushNotificationResponse;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.utils.MeasureFormatter;
import com.rocket.vitalis.utils.RestClient;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

import static com.rocket.vitalis.model.NotificationStatus.OPEN;
import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

/**
 * Created by sscotti on 11/12/16.
 */
@Service
@Log4j
public class NotificationService {

    @Autowired  private AlertService        alertService;

    @Autowired  private MonitoringService   followerService;

    @Autowired  private UserService         userService;

    @Autowired  private RestClient          restClient;

    @Autowired  private MeasureFormatter    measureFormatter;

    public void checkMeasures(Measurement measurement){

        // Mando las notificaciones y evalúo si no hay ninguna alerta ya abierta para esta medición
            doCheckMeasures(measurement);

    }

    private void doCheckMeasures(Measurement measurement) {
        MeasurementType measurementType = measurement.getType();
        Collection<AlertRule> alertRules = loadRules(measurement);
        Collection<User> followers = new HashSet<>();
        Collection<DeviceToken> deviceTokensRecipients = new HashSet<>();

        // Levanto las alertas abiertas del monitoreo actual
        Collection<AlertNotification> openAlerts = alertService.getOpenAlerts(measurement.getMonitoring(),
                measurement.getType());

        // Obtengo los dueños de las alertas abiertas para filtrarlos después
        Set<User> openAlertsOwners = openAlerts.stream()
                .map(AlertNotification::getOwner)
                .collect(toSet());

        // Levanto reglas por defecto
        Collection<AlertRule> defaultRules = alertService.getDefaultRules(measurementType);


        // Levanto los followers del monitoreo en la primera regla que cumpla
        Optional<Collection<User>> defaultFollowers =    defaultRules.stream()
                                                                .filter(rule -> rule.matches(measurement))
                                                                .findFirst()
                                                                .map(alertRule -> getFollowersIds(measurement));

        // Si alguna regla se cumplió, levanto los followers excluyendo los que tengan una alerta abierta
        if(defaultFollowers.isPresent()){
            followers.addAll(   defaultFollowers.get()
                                                .stream()
                                                .filter(follower -> !openAlertsOwners.contains(follower))
                                                .collect(toSet()));
        }

        // Levanto los usuarios de alertas custom que matcheen con el valor actual
        Collection<User> customAlertsUsers =    alertRules.stream()
                .filter(rule -> rule.matches(measurement))
                .filter(rule -> !openAlertsOwners.contains(rule.getSource().getCreatedBy()))
                .map(rule -> rule.getSource().getCreatedBy())
                .collect(toSet());

        // Agrego los usuarios de alertas custom a la lista de destinatarios
        followers.addAll(customAlertsUsers);

        deviceTokensRecipients.addAll(userService.getUsersTokens(followers));

        followers.forEach(follower -> {
            AlertNotification notification = new AlertNotification(measurement, follower, OPEN);

            alertService.createNotification(notification);
        });

        deviceTokensRecipients.stream().forEach(deviceToken ->
                        sendNewMonitoringNotification(deviceToken, measurement)
        );
    }

    private Collection<User> getFollowersIds(Measurement measurement) {
        Long monitoringId = measurement.getMonitoring().getId();

        Collection<Follower> followers = followerService.getFollowers(monitoringId);

        return followers.stream()
                .map(Follower::getUser)
                .collect(toList());
    }

    @Transactional
    private void sendNewMonitoringNotification(DeviceToken deviceToken, Measurement measurement) {

        PushNotificationDto pushNotification = createPushNotification(deviceToken, measurement);

        ResponseEntity<PushNotificationResponse> response = restClient.create("https://gcm-http.googleapis.com/gcm/send")
                .addHeader("Authorization", "key=AIzaSyCsp9CPiln_EvQ4ZLz6sx70J-ATTNIeMbk")
                .contentType(MediaType.APPLICATION_JSON)
                .payload(pushNotification)
                .post(PushNotificationResponse.class);

        PushNotificationResponse payload = response.getBody();

        if(payload.getSuccess() == 1){
            log.info(format("Success %s", payload));
        } else if(payload.getFailure() == 1){
            log.error(format("Error %s", payload));
        }
    }

    private void sendNotification(PushNotificationDto pushNotification) {
        ResponseEntity<PushNotificationResponse> response = restClient.create("https://gcm-http.googleapis.com/gcm/send")
                .addHeader("Authorization", "key=AIzaSyCsp9CPiln_EvQ4ZLz6sx70J-ATTNIeMbk")
                .contentType(MediaType.APPLICATION_JSON)
                .payload(pushNotification)
                .post(PushNotificationResponse.class);

        PushNotificationResponse payload = response.getBody();

        if(payload.getSuccess() == 1){
            log.info(format("Success %s", payload));
        } else if(payload.getFailure() == 1){
            log.error(format("Error %s", payload));
        }
    }

    private PushNotificationDto createPushNotification(DeviceToken deviceToken, Measurement measurement) {

        String patientName = measurement.getMonitoring().getPatient().getName();
        String measurementType = measurement.getType().getName();

        String formattedValue = measureFormatter.getFormattedValue(measurement);

        String pushMessage = format("%s de %s para %s", formattedValue, measurementType, patientName);
        String pushSummaryText = format("Se ha lanzado una alerta (%s)", formattedValue);

        PushNotificationDto.PushNotificationData data = new PushNotificationDto.PushNotificationData();
        data.setTitle("Nueva alerta");
        data.setMessage(pushMessage);
        data.setImage("www/img/logo-64x64-color.png");
        data.setVibrate(1);
        data.setSound(1);
        data.setStyle("inbox");
        data.setSummaryText(pushSummaryText);

        return new PushNotificationDto(deviceToken.getToken(), data);

    }

    private PushNotificationDto createRequestNotification(DeviceToken deviceToken, Request request) {

        String requesterName = request.getRequestedBy().getName();
        User patient = request.getMonitoring().getPatient();
        String pushMessage;
        if(patient.getId().equals(deviceToken.getSession().getUser().getId())){
            pushMessage = format("%s solicitó seguirte", requesterName);
        } else {
            pushMessage = format("%s solicitó seguir a %s", requesterName, patient.getName());
        }

        String pushSummaryText = format("Toca para ver más");

        PushNotificationDto.PushNotificationData data = new PushNotificationDto.PushNotificationData();
        data.setTitle("Nueva solicitud");
        data.setMessage(pushMessage);
        data.setImage("www/img/logo-64x64-color.png");
        data.setVibrate(1);
        data.setSound(1);
        data.setStyle("inbox");
        data.setSummaryText(pushSummaryText);

        return new PushNotificationDto(deviceToken.getToken(), data);

    }

    private PushNotificationDto createMonitoringNotification(DeviceToken deviceToken, Monitoring monitoring) {

        String patientName = monitoring.getPatient().getName();

        String pushMessage = format("Comenzaste a seguir a %s", patientName);
        String pushSummaryText = format("Toca para ver más");

        PushNotificationDto.PushNotificationData data = new PushNotificationDto.PushNotificationData();
        data.setTitle("Nueva solicitud");
        data.setMessage(pushMessage);
        data.setImage("www/img/logo-64x64-color.png");
        data.setVibrate(1);
        data.setSound(1);
        data.setStyle("inbox");
        data.setSummaryText(pushSummaryText);

        return new PushNotificationDto(deviceToken.getToken(), data);

    }


    private Collection<AlertRule> loadRules(Measurement measurement) {
        Monitoring monitoring = measurement.getMonitoring();
        MeasurementType measurementType = measurement.getType();

        Collection<Alert> userAlerts = alertService.getAlertsFor(monitoring, measurementType);

        return userAlerts.stream().map(AlertRule::new).collect(toList());

    }

    public void sendNewMonitoringNotification(Collection<Long> peopleToNotify, Monitoring monitoring) {
        Collection<DeviceToken> userIdsTokens = userService.getUserIdsTokens(peopleToNotify);

        userIdsTokens.stream().forEach(deviceToken -> {
            PushNotificationDto notification = createMonitoringNotification(deviceToken, monitoring);
            sendNotification(notification);
        });
    }

    public void sendRequestNotification(Collection<Long> peopleToNotify, Request request) {
        Collection<DeviceToken> userIdsTokens = userService.getUserIdsTokens(peopleToNotify);

        userIdsTokens.stream().forEach(deviceToken -> {
            PushNotificationDto notification = createRequestNotification(deviceToken, request);
            sendNotification(notification);
        });
    }
}
