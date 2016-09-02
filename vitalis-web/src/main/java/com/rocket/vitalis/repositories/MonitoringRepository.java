package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Monitoring;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 8/13/16.
 */
public interface MonitoringRepository extends CrudRepository<Monitoring, Long> {

    Monitoring findById(Long id);
}
