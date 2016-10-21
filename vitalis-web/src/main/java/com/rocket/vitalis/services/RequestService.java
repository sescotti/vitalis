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
    private RequestRepository requestRepository;

    @Autowired
    private FollowerRepository followerRepository;


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

    public Request findRequest(Long id){
        Request request = requestRepository.findById(id);
        return request;
    }

    public Request save(Request request){
        return requestRepository.save(request);
    }

}
