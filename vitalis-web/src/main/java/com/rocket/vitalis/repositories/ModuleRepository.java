package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Module;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 8/13/16.
 */
public interface ModuleRepository extends CrudRepository<Module, Long> {

    Page<Module> findById (Long id, Pageable page);
}
