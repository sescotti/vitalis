package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import javax.persistence.*;

/**
 * Created by Sebastian on 25/9/2016.
 */

@Entity
public class Follower {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private FollowerType followerType;

    @Column
    @Getter @Setter
    private Boolean isAdmin;

    /*
    DEBE ESTAR RELACIONADO CON User, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private User user;

    /*
   DEBE ESTAR RELACIONADO CON Monitoring, relación *-1
   */
    @ManyToOne
    @Getter @Setter
    private Monitoring monitoring;

}
