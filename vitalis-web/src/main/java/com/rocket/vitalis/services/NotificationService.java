package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.AlertRule;
import com.rocket.vitalis.dto.google.PushNotificationDto;
import com.rocket.vitalis.dto.google.PushNotificationResponse;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.utils.RestClient;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;

/**
 * Created by sscotti on 11/12/16.
 */
@Service
@Log4j
public class NotificationService {

    @Autowired
    private AlertService        alertService;

    @Autowired
    private RulesService        rulesService;

    @Autowired
    private MonitoringService   followerService;

    @Autowired
    private UserService         userService;

    @Autowired
    private RestClient restClient;

    public void checkMeasures(Measurement measurement){

        MeasurementType measurementType = measurement.getType();
        Collection<AlertRule> alertRules = loadRules(measurement);

        Collection<AlertRule> defaultRules = rulesService.getDefaultRules(measurementType);

        defaultRules.stream().forEach(alertRule -> {
            boolean matches = alertRule.matches(measurement);

            if(matches){
                sendNotification(measurement);
            }
        });
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
            }

        });

    }

    private PushNotificationDto createPushNotification(DeviceToken deviceToken, Measurement measurement) {

        String patientName = measurement.getMonitoring().getPatient().getName();
        String measurementType = measurement.getType().getName();

        PushNotificationDto.PushNotificationData data = new PushNotificationDto.PushNotificationData();
        data.setTitle("Nueva alerta");
        data.setMessage(format("Alerta de %s para %s", measurementType, patientName));
        data.setMessage("www/img/vitalis_logo.png");
        data.setVibrate(1);
        data.setSound(1);
        data.setStyle("inbox");
        data.setSummaryText("Sumarizame esta");

        return new PushNotificationDto(deviceToken.getToken(), data);

    }

    private Collection<AlertRule> loadRules(Measurement measurement) {
        Monitoring monitoring = measurement.getMonitoring();
        MeasurementType measurementType = measurement.getType();
        Collection<Alert> userAlerts = alertService.getAlertsFor(monitoring, measurementType);

        Collection<AlertRule> defaultRules = rulesService.getDefaultRules(measurementType);
        List<AlertRule> collect = userAlerts.stream().map(AlertRule::new).collect(toList());

        Collection<AlertRule> rules = new ArrayList<>(defaultRules);
        rules.addAll(collect);

        return rules;
    }
}
