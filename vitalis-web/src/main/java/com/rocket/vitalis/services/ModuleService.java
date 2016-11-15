package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.ModuleDto;
import com.rocket.vitalis.dto.MonitoringRequest;
import com.rocket.vitalis.exceptions.ModuleAlreadyRegisteredException;
import com.rocket.vitalis.model.*;
import com.rocket.vitalis.repositories.*;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

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

    @Autowired
    private SensorRepository sensorRepository;

    public Collection<Module> findModules(User user){
        return moduleRepository.findByOwner(user);
    }
    public Collection<Monitoring> findMonitorings(Collection<Module> modules){
        return monitoringRepository.findByModuleInAndFinishDateIsNull(modules);
    }

    public Module addModule(User user, String serial) throws ModuleAlreadyRegisteredException {
        try{
            Module module = new Module(serial, user);
            moduleRepository.save(module);
            return module;
        } catch (DataIntegrityViolationException e) {
            throw new ModuleAlreadyRegisteredException(e);
        }

    }

    public Monitoring getMonitoring(Long moduleId){
        Monitoring monitoring = monitoringRepository.findByModuleIdAndFinishDateIsNull(moduleId);
        return monitoring;
    }

    public Module getModule(Long moduleId){
        Module module = moduleRepository.findOne(moduleId);
        return module;
    }

    public Collection<ModuleDto> getModules(User user){
        Collection<Module> modules = findModules(user);
        Collection<Monitoring> monitorings = findMonitorings(modules);

        Map<Long, Monitoring> moma = monitorings.stream().collect(Collectors.toMap(monitoring -> monitoring.getModule().getId(), o -> o));

        return modules.stream().map(module -> {
            Monitoring monitoring = moma.get(module.getId());
            return new ModuleDto(module, monitoring);
        }).collect(toList());

    }

    public Module deleteModule(Long moduleId){
        Module module = moduleRepository.findOne(moduleId);
        moduleRepository.delete(module);
        return module;
    }


    @Transactional
    public Monitoring initMonitoring(Long moduleId, MonitoringRequest.PatientDto patientId,  Collection<MonitoringRequest.FollowerDto> followers,
                                     Collection<MonitoringRequest.SensorDto> sensors, User userOwner ){

        List<Sensor> mySensors = sensors.stream().map(Sensor::new).collect(toList());

        sensorRepository.save(mySensors);

        Module module = moduleRepository.findOne(moduleId);
        User patient = userRepository.findOne(patientId.getId());
        Monitoring monitoring = new Monitoring(module,patient, mySensors);

        monitoringRepository.save(monitoring);

        Map<Long, MonitoringRequest.FollowerDto> followersMap = followers.stream().collect(toMap(MonitoringRequest.FollowerDto::getId, followerDto -> followerDto));

        MonitoringRequest.FollowerDto followerDto = followersMap.get(userOwner.getId());

        // El dueño del módulo es admin por defecto
        if(followerDto != null){
            followerDto.setIsAdmin(true);
        } else {
            followers.add(new MonitoringRequest.FollowerDto(userOwner.getId(), true));
        }

        List<Follower> collect = followers.stream().map(item -> {
            User user = userRepository.findOne(item.getId());
            return new Follower(user, monitoring, item.getIsAdmin());
        }).collect(toList());

        followerRepository.save(collect);

        return monitoring;
    }

}
