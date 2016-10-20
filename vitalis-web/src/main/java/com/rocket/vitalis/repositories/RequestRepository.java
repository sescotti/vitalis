package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.*;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Created by Ailin on 18/10/2016.
 */
public interface RequestRepository extends CrudRepository<Request, Long> {
    Request findById(Long id);
    Iterable<SimpleRequest> findByRequestedBy(User user);
    Iterable<SimpleRequest> findByMonitoringPatientAndRequestStatus(User user, RequestStatus requestStatus);
    Iterable<SimpleRequest> findByMonitoringInAndRequestStatus(Collection<Monitoring> monitoring, RequestStatus requestStatus);
}
