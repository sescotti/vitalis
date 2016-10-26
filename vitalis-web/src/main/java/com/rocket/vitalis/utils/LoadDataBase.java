package com.rocket.vitalis.utils;

import com.rocket.vitalis.dto.MonitoringRequest;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.*;
import com.rocket.vitalis.services.ModuleService;
import lombok.extern.log4j.Log4j;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
 * Created by Ailin on 25/10/2016.
 */
@Service
@Profile("dev")
@Log4j
public class LoadDataBase {
    @Autowired  private UserRepository          userRepository;
    @Autowired  private MonitoringRepository    monitoringRepository;
    @Autowired  private MeasurementRepository   measurementRepository;
    @Autowired  private ModuleService           moduleService;

    public void initApplicationData(){

        /*Creo usuarios*/
        Collection<User> users = new ArrayList<>(6);
        User user1  = registerUser("sebastians@vitalis.com", "1234", "Sebastian Scotti", Gender.MALE);
        users.add(user1);
        User user2  = registerUser("ailin@vitalis.com", "1234", "Ailin R Merlo", Gender.FEMALE);
        users.add(user2);
        User user3  = registerUser("sebastianp@vitalis.com", "1234", "Sebastian Pantuso", Gender.MALE);
        users.add(user3);
        User user4  = registerUser("aldo@vitalis.com", "1234", "Aldo Flores", Gender.MALE);
        users.add(user4);
        User user5  = registerUser("mariano@vitalis.com", "1234", "Mariano Ramirez", Gender.MALE);
        users.add(user5);

        User sancho = registerUser("sancho@vitalis.com", "1234", "Sancho Panza", Gender.MALE);
        userRepository.save(sancho);

        /*Creo Modulos*/
        Module module1 = registerModule(sancho);
        Module module2 = registerModule(sancho);

        /*Creo Monitoreos*/
        MonitoringRequest.PatientDto patient = new MonitoringRequest.PatientDto();
        patient.setId(user5.getId());
        Collection<MonitoringRequest.FollowerDto> followerDtos = new ArrayList<MonitoringRequest.FollowerDto>();
        followerDtos.add(new MonitoringRequest.FollowerDto(user1.getId(), false));
        followerDtos.add(new MonitoringRequest.FollowerDto(user2.getId(), false));

        Collection<MonitoringRequest.SensorDto> sensors = new ArrayList<MonitoringRequest.SensorDto>();
        sensors.add(new MonitoringRequest.SensorDto(MeasurementType.BLOOD_OXYGEN, SensorStatus.ENABLED));
        sensors.add(new MonitoringRequest.SensorDto(MeasurementType.BLOOD_PRESSURE, SensorStatus.ENABLED));
        sensors.add(new MonitoringRequest.SensorDto(MeasurementType.ECG, SensorStatus.ENABLED));
        sensors.add(new MonitoringRequest.SensorDto(MeasurementType.HEART_RATE, SensorStatus.ENABLED));
        sensors.add(new MonitoringRequest.SensorDto(MeasurementType.RESPIRATORY_RATE, SensorStatus.ENABLED));
        sensors.add(new MonitoringRequest.SensorDto(MeasurementType.TEMPERATURE, SensorStatus.ENABLED));
        Monitoring monitoring1 = moduleService.initMonitoring(module1.getId(),patient,followerDtos,sensors, sancho);
        monitoring1.setFinishDate(new Date());
        monitoringRepository.save(monitoring1);

        createMeasurements(monitoring1);


        MonitoringRequest.PatientDto patient2 = new MonitoringRequest.PatientDto();
        patient2.setId(user1.getId());
        Collection<MonitoringRequest.FollowerDto> followerDtos2 = new ArrayList<MonitoringRequest.FollowerDto>();
        followerDtos2.add(new MonitoringRequest.FollowerDto(user4.getId(), false));
        followerDtos2.add(new MonitoringRequest.FollowerDto(user2.getId(), false));
        followerDtos2.add(new MonitoringRequest.FollowerDto(user3.getId(), false));

        Collection<MonitoringRequest.SensorDto> sensors2 = new ArrayList<MonitoringRequest.SensorDto>();
        sensors2.add(new MonitoringRequest.SensorDto(MeasurementType.BLOOD_OXYGEN, SensorStatus.ENABLED));
        sensors2.add(new MonitoringRequest.SensorDto(MeasurementType.BLOOD_PRESSURE, SensorStatus.ENABLED));
        sensors2.add(new MonitoringRequest.SensorDto(MeasurementType.ECG, SensorStatus.ENABLED));
        sensors2.add(new MonitoringRequest.SensorDto(MeasurementType.HEART_RATE, SensorStatus.ENABLED));
        sensors2.add(new MonitoringRequest.SensorDto(MeasurementType.RESPIRATORY_RATE, SensorStatus.ENABLED));
        sensors2.add(new MonitoringRequest.SensorDto(MeasurementType.TEMPERATURE, SensorStatus.ENABLED));
        Monitoring monitoring2 = moduleService.initMonitoring(module1.getId(),patient2,followerDtos2,sensors2, sancho);

        createMeasurements(monitoring2);

    }

    private Module registerModule(User owner) {
        String serialNumber = UUID.randomUUID().toString().replace("-","").substring(10);
        return moduleService.addModule(owner, serialNumber);
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
            lastValues.put(BLOOD_PRESSURE, nextSystolicPressure);
            lastValuesSecondary.put(BLOOD_PRESSURE, nextDiastolicPressure);

            measurements.add(new Measurement(monitoring, time.toDate(), TEMPERATURE, nextTemperature));
            measurements.add(new Measurement(monitoring, time.toDate(), BLOOD_OXYGEN, nextBloodOxygen));
            measurements.add(new Measurement(monitoring, time.toDate(), RESPIRATORY_RATE, nextRespiratoryRate));
            measurements.add(new Measurement(monitoring, time.toDate(), HEART_RATE, nextHeartRate));
            measurements.add(new Measurement(monitoring, time.toDate(), BLOOD_PRESSURE, nextSystolicPressure, nextDiastolicPressure));
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

    public User registerUser(String email, String password, String name, Gender gender){

        try {
            String hash = createHash(password);
            String pictureUrl = getPictureUrl(email);

            User user = new User(email, hash);
            user.setName(name);
            user.setPictureUrl(pictureUrl);
            user.setIsDoctor(false);
            user.setUserType(UserType.NORMAL);
            user.setHeight(randomInteger(160, 190));
            user.setWeight(randomInteger(50, 85));
            user.setBloodFactor(RH_NEGATIVE);
            user.setBloodType(ZERO);

            Date fechaCumple = null;
            try {
                fechaCumple= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse("1988-08-20 04:16:00.000");
            } catch (ParseException e) {
                fechaCumple = new Date();
            }

            user.setBirthDate(fechaCumple);
            user.setDocNumber("33.245.334");
            user.setGender(gender);

            return userRepository.save(user);

        } catch (PBKDF2Service.CannotPerformOperationException e) {
            throw new IllegalStateException(e);
        }

    }
}
