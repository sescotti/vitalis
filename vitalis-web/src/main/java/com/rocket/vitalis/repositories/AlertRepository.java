package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.*;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Created by Ailin on 21/10/2016.
 */
public interface AlertRepository  extends CrudRepository<Alert, Long> {

    Collection<Alert> findByMonitoringPatient(User user);
    Collection<Alert> findByCreatedBy(User user);
    Collection<Alert> findByMonitoringAndMeasurementType(Monitoring monitoring, MeasurementType measurementType);

}
