package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.AccessToken;
import com.rocket.vitalis.model.DeviceToken;
import com.rocket.vitalis.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.Optional;

/**
 * Created by sscotti on 11/14/16.
 */
public interface DeviceTokenRepository extends CrudRepository<DeviceToken, Long>{

    Collection<DeviceToken> findBySessionUserId(Long userId);

    Collection<DeviceToken> findBySessionUserIdIn(Collection<Long> userIds);

    Collection<DeviceToken> findBySessionUserIn(Collection<User> users);

    Optional<DeviceToken> findBySession(AccessToken accessToken);
}
