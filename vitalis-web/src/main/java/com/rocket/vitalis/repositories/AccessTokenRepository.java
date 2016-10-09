package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.AccessToken;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by sscotti on 10/7/16.
 */
public interface AccessTokenRepository extends CrudRepository<AccessToken, String> {

    AccessToken findByToken(String token);

//    Long getUserId(String token);
}
