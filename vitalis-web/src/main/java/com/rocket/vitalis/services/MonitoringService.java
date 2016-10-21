package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.MeasurementDto;
import com.rocket.vitalis.dto.MonitoringDto;
import com.rocket.vitalis.dto.SensorDto;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.repositories.MeasurementRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.repositories.RequestRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

//import static com.rocket.vitalis.model.MeasurementType.DIASTOLIC_PRESSURE;
//import static com.rocket.vitalis.model.MeasurementType.SYSTOLIC_PRESSURE;
import static java.util.Arrays.asList;
import static org.springframework.data.domain.Sort.Direction.DESC;

/**
 * Created by sscotti on 10/17/16.
 */
@Service
@Log4j
public class MonitoringService {

    private static final int PAGE_SIZE = 15;

//    private static final List<MeasurementType> MERGEABLE_TYPES = asList(DIASTOLIC_PRESSURE, SYSTOLIC_PRESSURE);

    @Autowired private MonitoringRepository monitoringRepository;
    @Autowired private MeasurementRepository measurementRepository;

    @Autowired private RequestRepository requestRepository;
    @Autowired private FollowerRepository followerRepository;


//    @Transactional
//    public MonitoringDto findById(Long id){
//        Monitoring monitoring = monitoringRepository.findById(id);
//        Collection<Sensor> sensors = monitoring.getSensors();
//
//        List<SensorDto> monitoringSensors = sensors .stream()
//                                                    .filter(sensor -> !MERGEABLE_TYPES.contains(sensor.getMeasurementType()))
//                                                    .map(SensorDto::new)
//                                                    .collect(Collectors.toList());
//
//        Optional<SensorDto> reduce = sensors.stream()
//                .filter(sensor -> MERGEABLE_TYPES.contains(sensor.getMeasurementType()))
//                .map(SensorDto::fromPressureSensor)
//                .reduce((sensor1, sensor2) -> {
//
//                    String lastValue = sensor1.getLastValue() + "/" + sensor2.getLastValue();
//                    return new SensorDto(sensor1.getMeasurementType(), sensor1.getStatus(), sensor1.getLastMonitoringDate(), lastValue);
//                });
//
//        if(reduce.isPresent()){
//            monitoringSensors.add(reduce.get());
//        }
//
//        MonitoringDto monitoringDto = new MonitoringDto();
//        monitoringDto.setFinishDate(monitoring.getFinishDate());
//        monitoringDto.setModule(monitoring.getModule());
//        monitoringDto.setPatient(monitoring.getPatient());
//        monitoringDto.setStartDate(monitoring.getStartDate());
//        monitoringDto.setSensors(monitoringSensors);
//
//        return monitoringDto;
//    }

    @Transactional
    public Monitoring findById(Long id){
        return monitoringRepository.findById(id);
    }


    public Collection<SimpleMeasurement> findMeasurements(Long monitoringId, MeasurementType type){
        return findMeasurements(monitoringId, type, 0);
    }

    @Transactional
    public Collection<SimpleMeasurement> findMeasurements(Long monitoringId, MeasurementType type, int pageNumber){
        Page<SimpleMeasurement> measurements = measurementRepository.findByMonitoringIdAndType(monitoringId, type, new PageRequest(pageNumber, PAGE_SIZE, DESC, "measurementDate"));
        return measurements.getContent();
    }

    public Collection<SimpleMonitoring> findMonitoringByUserName(User user, String userName){

        /*Todos los monitoreos ACTIVOS cuyo nombre de usuario comienzan con "userName" */
        Iterable<SimpleMonitoring> monitorings = monitoringRepository.findByPatientNameStartingWithIgnoreCaseAndFinishDateIsNull(userName);
        /*Lo copio en una coleccion para ir borrando los que no van*/
        Collection<SimpleMonitoring> collectionMonitorings = new ArrayList<SimpleMonitoring>();
        monitorings.forEach(collectionMonitorings::add);

        /*Todos los Request hechos por el usuario  - para no mostrar Monitoreos que ya tienen un Request hecho"
        Sea Pendiente (Se muestra en Pendientes), Rechazado (No se muestra mas), Aceptado(se muestra en Siguiendo) */
        Iterable<SimpleRequest> requests = requestRepository.findByRequestedBy(user);

        /*Todos los Following del usuario - para no mostrar Monitoreos que ya se estan siguiendo*/
        Iterable<SimpleFollower> followers = followerRepository.findByUser(user);

        for (SimpleMonitoring item : monitorings) {
            if (StreamSupport.stream(requests.spliterator(), false).anyMatch(miItem -> item.getId().equals(miItem.getMonitoring().getId())))
                collectionMonitorings.remove(item);
            if (StreamSupport.stream(followers.spliterator(), false).anyMatch(miItem -> item.getId().equals(miItem.getMonitoring().getId())))
                collectionMonitorings.remove(item);
        }

        return collectionMonitorings;
    }

}
