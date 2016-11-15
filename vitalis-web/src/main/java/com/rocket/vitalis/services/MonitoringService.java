package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.MeasurementDto;
import com.rocket.vitalis.dto.MonitoringDto;
import com.rocket.vitalis.dto.SensorDto;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.*;
import com.sun.org.apache.xpath.internal.operations.Bool;
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

    @Autowired private MonitoringRepository monitoringRepository;
    @Autowired private MeasurementRepository measurementRepository;

    @Autowired private RequestRepository requestRepository;
    @Autowired private FollowerRepository followerRepository;
    @Autowired private UserRepository userRepository;

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

    public Collection<SimpleFollower> findActiveMonitoringsFollowedByUser(User user){
        Collection<SimpleFollower> monitorings = followerRepository.findByUserAndMonitoringFinishDateIsNull(user);
        return monitorings;
    }

    public Collection<MeasurementType> getMonitoringSensors(Long monitoringId){
        Monitoring monitoring = monitoringRepository.findOne(monitoringId);
        Collection<Sensor> sensorCollection = monitoring.getSensors() ;
        Collection<MeasurementType> measurementTypes = new ArrayList<MeasurementType>();
        sensorCollection.forEach(item -> measurementTypes.add(item.getMeasurementType()));
        return measurementTypes;
    }

    public Collection<User> findUsersLikeNotFollowers(Long montoringId, String userName){
        /* Todos los usuarios */
        Collection<User> users = userRepository.findByNameContainingIgnoreCase(userName);
        Collection<User> collectionUsers = new ArrayList<User>();
        users.forEach(collectionUsers::add);

        /* Los usuarios que tienen monitoreos*/
        Collection<Follower> followers = followerRepository.findByMonitoringId(montoringId);

        for (User item : users) {
            if (StreamSupport.stream(followers.spliterator(), false).anyMatch(miItem -> item.getId().equals(miItem.getUser().getId())))
                collectionUsers.remove(item);
        }
        return collectionUsers;
    }

    public Collection<Follower> getFollowers(Long monitoringId){
        Collection<Follower> followers = followerRepository.findByMonitoringId(monitoringId);
        return followers;
    }

    public Follower addFollower(Long monitoringId, Long userId){
        User user = userRepository.findOne(userId);
        Monitoring monitoring = monitoringRepository.findOne(monitoringId);
        Follower follower = new Follower(user, monitoring);
        followerRepository.save(follower);
        return  follower;
    }

    public Follower modifyFollower(Long followerId, Boolean isAdmin){
        Follower follower = followerRepository.findOne(followerId);
        follower.setIsAdmin(isAdmin);
        followerRepository.save(follower);
        return  follower;
    }

    public Follower deleteFollower(Long followerId){
        Follower follower = followerRepository.findOne(followerId);
        follower.setIsAdmin(!(follower.getIsAdmin()));
        followerRepository.delete(follower);
        return  follower;
    }

    public Monitoring finishMonitoring(Long monitoringId){
        Monitoring monitoring = monitoringRepository.findOne(monitoringId);
        monitoring.setFinishDate(new Date());
        monitoringRepository.save(monitoring);
        return monitoring;
    }

    public Monitoring findActiveMonitoringByUser(User user) {
        return monitoringRepository.findByPatientIdAndFinishDateIsNull(user.getId());
    }

    public void deleteFollower(Long monitoringId, Long userId) {
        Follower follower = followerRepository.findByMonitoringIdAndUserId(monitoringId, userId);
        followerRepository.delete(follower);
    }
}
