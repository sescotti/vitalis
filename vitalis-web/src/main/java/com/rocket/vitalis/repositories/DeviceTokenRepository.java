package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.DeviceToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Created by sscotti on 11/14/16.
 */
public interface DeviceTokenRepository extends CrudRepository<DeviceToken, Long>{

    Collection<DeviceToken> findBySessionUserId(Long userId);

    Collection<DeviceToken> findBySessionUserIdIn(Collection<Long> userIds);
}
