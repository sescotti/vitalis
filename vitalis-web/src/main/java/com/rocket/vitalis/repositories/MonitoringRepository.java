package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Monitoring;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 8/13/16.
 */
public interface MonitoringRepository extends CrudRepository<Monitoring, Long> {

    Page<Monitoring> findById(Long id, Pageable page);
}
