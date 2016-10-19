package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 8/13/16.
 */
public interface MeasurementRepository extends CrudRepository<Measurement, Long> {

    Measurement findById(Long id);
    Page<SimpleMeasurement> findByMonitoringIdAndType(Long monitoringId, MeasurementType type, Pageable pageConfig);

}
