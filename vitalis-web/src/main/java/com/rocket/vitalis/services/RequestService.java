package com.rocket.vitalis.services;

import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.repositories.RequestRepository;
import com.rocket.vitalis.repositories.UserRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.stream.StreamSupport;

/**
 * Created by Ailin on 19/10/2016.
 */
@Service
@Log4j
public class RequestService {

    @Autowired
    private MonitoringRepository monitoringRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private FollowerRepository followerRepository;


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

    public Iterable<SimpleRequest> findSentRequest(User user){
        Iterable<SimpleRequest> request = requestRepository.findByRequestedBy(user);
        return request;
    }

    public Iterable<SimpleRequest> findMyPendingRequest(User user){
        Iterable<SimpleRequest> request = requestRepository.findByMonitoringPatientAndRequestStatus(user, RequestStatus.PENDING);
        return request;
    }

    public Iterable<SimpleRequest> findPendingRequest(User user){
        Collection<Follower> following = followerRepository.findByUserAndIsAdminTrue(user);
        Collection<Monitoring> monitorings =  new ArrayList<Monitoring>();
        following.forEach(item -> monitorings.add(item.getMonitoring()));

        Iterable<SimpleRequest> request = requestRepository.findByMonitoringInAndRequestStatus(monitorings, RequestStatus.PENDING);
        return request;
    }

    public Monitoring findMonitoring(Long id){
        Monitoring monitoring = monitoringRepository.findById(id);
        return monitoring;
    }

}
