package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Request;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 18/10/2016.
 */
public interface RequestRepository extends CrudRepository<Request, Long> {
    Request findById(Long id);
}
