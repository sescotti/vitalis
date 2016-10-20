package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Request;
import com.rocket.vitalis.model.SimpleRequest;
import com.rocket.vitalis.model.User;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 18/10/2016.
 */
public interface RequestRepository extends CrudRepository<Request, Long> {
    Request findById(Long id);
    Iterable<SimpleRequest> findByRequestedBy(User user);
}
