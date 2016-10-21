package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Created by Ailin on 8/13/16.
 */
public interface ModuleRepository extends CrudRepository<Module, Long> {

    Collection<Module> findByRegisteredBy(User registeredBy);


}
