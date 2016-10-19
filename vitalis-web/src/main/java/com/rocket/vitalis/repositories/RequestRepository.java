package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Request;
import com.rocket.vitalis.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 18/10/2016.
 */
public interface RequestRepository extends CrudRepository<Request, Long> {
    Request findById(Long id);
    Iterable<Request> findByRequestedBy(User user);
}
