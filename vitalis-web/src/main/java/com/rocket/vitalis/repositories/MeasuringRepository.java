package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Measuring;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 8/13/16.
 */
public interface MeasuringRepository extends CrudRepository<Measuring, Long> {

    Page<Measuring> findById(Long id, Pageable page);
}
