package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.User;
import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.Monitoring;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import java.util.Date;


/**
 * Created by Ailin on 8/13/16.
 */
public interface MonitoringRepository extends CrudRepository<Monitoring, Long> {

    Monitoring findById(Long id);
    Iterable<Monitoring> findByModule(Module module);
    Monitoring findByModuleAndFinishDateIsNull(Module module);
    Monitoring findByPatientName(String name);
    Iterable<Monitoring> findByPatientNameStartingWithIgnoreCaseAndFinishDateIsNull(String name);
}


