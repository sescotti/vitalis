package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.Sensor;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Ailin on 8/13/16.
 */
public interface SensorRepository extends CrudRepository<Sensor, Long> {

}
