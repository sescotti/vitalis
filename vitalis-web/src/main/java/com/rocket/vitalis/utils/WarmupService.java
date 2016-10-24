package com.rocket.vitalis.utils;

import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.*;
import com.rocket.vitalis.services.RequestService;
import com.rocket.vitalis.utils.PBKDF2Service;
import com.rocket.vitalis.utils.VitalisUtils;
import lombok.extern.log4j.Log4j;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.rocket.vitalis.model.BloodFactor.RH_NEGATIVE;
import static com.rocket.vitalis.model.BloodType.ZERO;
import static com.rocket.vitalis.model.FollowerType.RELATIVE;
import static com.rocket.vitalis.model.MeasurementType.*;
import static com.rocket.vitalis.utils.PBKDF2Service.createHash;
import static com.rocket.vitalis.utils.PicturesMocks.getPictureUrl;
import static com.rocket.vitalis.utils.VitalisUtils.randomDouble;
import static com.rocket.vitalis.utils.VitalisUtils.randomInteger;
import static org.joda.time.DateTime.now;

/**
 * Created by sscotti on 10/9/16.
 */
@Service
@Profile("dev")
@Log4j
public class WarmupService {

    @Autowired  private UserRepository          userRepository;
    @Autowired  private MonitoringRepository    monitoringRepository;
    @Autowired  private SensorRepository        sensorRepository;
    @Autowired  private MeasurementRepository   measurementRepository;
    @Autowired  private FollowerRepository      followerRepository;
    @Autowired  private RequestRepository       requestRepository;

    public void initApplicationData(){

        Collection<User> users = new ArrayList<>(6);

        User sebas = registerUser("sebastians@vitalis.com", "1234", "Sebastian Scotti");

        users.add(sebas);
//        users.add(registerUser("sebastians@vitalis.com", "1234", "Sebastian Scotti"));
        users.add(registerUser("ailin@vitalis.com", "1234", "Ailin Merlo"));
        users.add(registerUser("sebastianp@vitalis.com", "1234", "Sebastian Pantuso"));
        users.add(registerUser("aldo@vitalis.com", "1234", "Aldo Flores"));
        users.add(registerUser("mariano@vitalis.com", "1234", "Mariano Ramirez"));

        User sancho = registerUser("sancho@vitalis.com", "1234", "Sancho Panza");

        userRepository.save(sancho);

        Collection<Monitoring> monitorings = new ArrayList<>(users.size());
        Collection<Follower> followers = new ArrayList<>(users.size());
        Collection<Request> followRequests = new ArrayList<>(users.size());

        Monitoring sanchoMonitoring = createMonitoring(sancho);
        createMeasurements(sanchoMonitoring);

        for(User user : users){
            Monitoring monitoring = createMonitoring(user);
            createMeasurements(monitoring);

            monitorings.add(monitoring);
//            followers.add(createFollower(sancho, monitoring));
        }

        for(Monitoring monitoring : monitorings){
            followRequests.add(new Request(sebas, monitoring));
        }

        followerRepository.save(followers);
        requestRepository.save(followRequests);
    }

    private Follower createFollower(User user, Monitoring monitoring) {
        Follower follower = new Follower();
        follower.setFollowerType(RELATIVE);
        follower.setMonitoring(monitoring);
        follower.setUser(user);
        follower.setIsAdmin(true);

        return follower;
    }

    private Monitoring createMonitoring(User sebas) {
        Monitoring monitoring = new Monitoring();

        Collection<Sensor> sensors = new ArrayList<>(values().length);

        for(MeasurementType measurementType : values()){
            sensors.add(createSensor(measurementType));
        }

        sensorRepository.save(sensors);

        monitoring.setSensors(sensors);
        monitoring.setPatient(sebas);

        monitoring = monitoringRepository.save(monitoring);
        return monitoring;
    }

    private void createMeasurements(Monitoring monitoring) {
        DateTime time = now().minusMinutes(16);
        DateTime now = now();

        Collection<Measurement> measurements = new ArrayList<>(45);

        Map<MeasurementType, Double> lastValues             = new HashMap<>(3);
        Map<MeasurementType, Double> lastValuesSecondary    = new HashMap<>(3);

        while(time.plusMinutes(1).isBefore(now)) {

            double nextTemperature          = randomDouble(37d, 38d);
            double nextBloodOxygen          = randomDouble(98.5d, 99d);
            double nextRespiratoryRate      = (double) randomInteger(15, 18);
            double nextHeartRate            = (double) randomInteger(60, 100);

            double nextSystolicPressure     = (double) randomInteger(90, 119);
            double nextDiastolicPressure    = (double) randomInteger(60, 79);

            lastValues.put(TEMPERATURE, nextTemperature);
            lastValues.put(BLOOD_OXYGEN, nextBloodOxygen);
            lastValues.put(RESPIRATORY_RATE, nextRespiratoryRate);
            lastValues.put(HEART_RATE, nextHeartRate);
            lastValues.put(HEART_RATE, nextHeartRate);
            lastValues.put(BLOOD_PRESSURE, nextSystolicPressure);

            lastValuesSecondary.put(BLOOD_PRESSURE, nextDiastolicPressure);

//            lastValues.put(SYSTOLIC_PRESSURE, nextSystolicPressure);
//            lastValues.put(DIASTOLIC_PRESSURE, nextDiastolicPressure);

            measurements.add(new Measurement(monitoring, time.toDate(), TEMPERATURE, nextTemperature));
            measurements.add(new Measurement(monitoring, time.toDate(), BLOOD_OXYGEN, nextBloodOxygen));
            measurements.add(new Measurement(monitoring, time.toDate(), RESPIRATORY_RATE, nextRespiratoryRate));
            measurements.add(new Measurement(monitoring, time.toDate(), HEART_RATE, nextHeartRate));
            measurements.add(new Measurement(monitoring, time.toDate(), BLOOD_PRESSURE, nextSystolicPressure, nextDiastolicPressure));
//            measurements.add(new Measurement(monitoring, time.toDate(), SYSTOLIC_PRESSURE, nextSystolicPressure));
//            measurements.add(new Measurement(monitoring, time.toDate(), DIASTOLIC_PRESSURE, nextDiastolicPressure));

            time = time.plusMinutes(1);
        }

        final Date lastMonitoringDate = time.toDate();
        monitoring.getSensors().forEach(sensor -> {
            sensor.setLastMonitoringDate(lastMonitoringDate);
            sensor.setLastValue(lastValues.get(sensor.getMeasurementType()));
            sensor.setLastValueSecondary(lastValuesSecondary.get(sensor.getMeasurementType()));
        });

        monitoringRepository.save(monitoring);
        measurementRepository.save(measurements);
    }

    private Sensor createSensor(MeasurementType type) {
        return  new Sensor(type, SensorStatus.ENABLED);
    }

    public User registerUser(String email, String password, String name){

        try {
            String hash = createHash(password);
            String pictureUrl = getPictureUrl(email);

            User user = new User(email, hash);
            user.setName(name);
            user.setPictureUrl(pictureUrl);

            user.setHeight(randomInteger(160, 190));
            user.setWeight(randomInteger(50, 85));
            user.setBloodFactor(RH_NEGATIVE);
            user.setBloodType(ZERO);


            return userRepository.save(user);

        } catch (PBKDF2Service.CannotPerformOperationException e) {
            throw new IllegalStateException(e);
        }

    }
}
