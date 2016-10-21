package com.rocket.vitalis.services;

import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.repositories.ModuleRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.repositories.UserRepository;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.stream.StreamSupport;

/**
 * Created by Ailin on 20/10/2016.
 */
@Service
@Log4j
public class ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private MonitoringRepository monitoringRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowerRepository followerRepository;

    public Collection<Module> findModules(User user){
        Collection<Module> modules = moduleRepository.findByRegisteredBy(user);
        return modules;
    }

    public Module addModule(User user, String serial){
        Module module = new Module(serial, user);
        moduleRepository.save(module);
        return module;
    }

    public Monitoring getMonitoring(Long moduleId){
        Monitoring monitoring = monitoringRepository.findByModuleIdAndFinishDateIsNull(moduleId);
        return monitoring;
    }

    public Module getModule(Long moduleId){
        Module module = moduleRepository.findOne(moduleId);
        return module;
    }

    public Collection<User> findPatientsLike(String userName){
        /* Todos los usuarios */
        Collection<User> users = userRepository.findByNameContaining(userName);
        Collection<User> collectionUsers = new ArrayList<User>();
        users.forEach(collectionUsers::add);

        /* Los usuarios que tienen monitoreos*/
        Collection<SimpleMonitoring> monitorings = monitoringRepository.findByFinishDateIsNull();

        for (User item : users) {
            if (StreamSupport.stream(monitorings.spliterator(), false).anyMatch(miItem -> item.getId().equals(miItem.getPatient().getId())))
                collectionUsers.remove(item);
        }

        return collectionUsers;
    }

    public Collection<User> findUsersLike(Long montoringId, String userName){
        /* Todos los usuarios */
        Collection<User> users = userRepository.findByNameContaining(userName);
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

    public Monitoring initMonitoring(Long moduleId, Long userId){
        Module module = moduleRepository.findOne(moduleId);
        User user = userRepository.findOne(userId);
        Monitoring monitoring = new Monitoring(module,user);
        monitoringRepository.save(monitoring);
        return monitoring;
    }

    public Follower modifyFollower(Long followerId){
        Follower follower = followerRepository.findOne(followerId);
        follower.setIsAdmin(!(follower.getIsAdmin()));
        followerRepository.save(follower);
        return  follower;
    }

    public Follower deleteFollower(Long followerId){
        Follower follower = followerRepository.findOne(followerId);
        follower.setIsAdmin(!(follower.getIsAdmin()));
        followerRepository.save(follower);
        return  follower;
    }

    public Monitoring finishMonitoring(Long monitoringId){
        Monitoring monitoring = monitoringRepository.findOne(monitoringId);
        monitoring.setFinishDate(new Date());
        monitoringRepository.save(monitoring);
        return monitoring;
    }

}
