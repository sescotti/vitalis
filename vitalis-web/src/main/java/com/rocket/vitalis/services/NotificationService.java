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
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;

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

        MeasurementType measurementType = measurement.getType();
        Collection<AlertRule> alertRules = loadRules(measurement);

        Collection<AlertRule> defaultRules = alertService.getDefaultRules(measurementType);

        Collection<DeviceToken> deviceTokensRecipients = new HashSet<>();
        for(AlertRule rule : defaultRules){
            if(rule.matches(measurement)){
                deviceTokensRecipients = getFollowersTokens(measurement);
                break;
            }
        }

        Collection<Long> customAlertsUserIds =    alertRules.stream()
                                                            .filter(rule -> rule.matches(measurement))
                                                            .map(rule -> rule.getSource().getCreatedBy().getId())
                                                            .collect(Collectors.toSet());

        Collection<DeviceToken> usersTokens = userService.getUsersTokens(customAlertsUserIds);
        deviceTokensRecipients.addAll(usersTokens);

        deviceTokensRecipients.stream().forEach(deviceToken ->
            sendNotification(deviceToken, measurement)
        );

    }

    private Collection<DeviceToken> getFollowersTokens(Measurement measurement) {
        Long monitoringId = measurement.getMonitoring().getId();

        Collection<Follower> followers = followerService.getFollowers(monitoringId);

        List<Long> userIds = followers.stream().map(follower -> follower.getUser().getId()).collect(toList());

        return userService.getUsersTokens(userIds);

    }

    @Transactional
    private void sendNotification(DeviceToken deviceToken, Measurement measurement) {
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


    private void sendNotification(Measurement measurement) {

        Long monitoringId = measurement.getMonitoring().getId();

        Collection<Follower> followers = followerService.getFollowers(monitoringId);

        List<Long> userIds = followers.stream().map(follower -> follower.getUser().getId()).collect(toList());

        Collection<DeviceToken> usersTokens = userService.getUsersTokens(userIds);

        usersTokens.stream().forEach(deviceToken -> {

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

        });

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

    private Collection<AlertRule> loadRules(Measurement measurement) {
        Monitoring monitoring = measurement.getMonitoring();
        MeasurementType measurementType = measurement.getType();

        Collection<Alert> userAlerts = alertService.getAlertsFor(monitoring, measurementType);

        return userAlerts.stream().map(AlertRule::new).collect(toList());

    }

}
