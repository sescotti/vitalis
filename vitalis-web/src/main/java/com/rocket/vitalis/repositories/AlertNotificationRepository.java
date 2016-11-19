package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.*;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Created by sscotti on 11/18/16.
 */
public interface AlertNotificationRepository extends CrudRepository<AlertNotification, Long> {

    Collection<AlertNotification> findByMonitoringAndMeasurementTypeAndStatus(Monitoring monitoring, MeasurementType measurementType, NotificationStatus status);

    Collection<AlertNotification> findByOwnerOrderByCreationDateDesc(User user);
}
