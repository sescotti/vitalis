package com.rocket.vitalis.repositories;

import com.rocket.vitalis.model.Follower;
import com.rocket.vitalis.model.SimpleFollower;
import com.rocket.vitalis.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

/**
 * Created by Ailin on 16/10/2016.
 */
public interface FollowerRepository extends CrudRepository<Follower, Long> {

        Collection<SimpleFollower> findByUser(User user);
}
