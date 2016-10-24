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
public class Follower extends AbstractModel {

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private FollowerType followerType;

    @Column
    @Getter @Setter
    private Boolean isAdmin;

    @ManyToOne
    @Getter @Setter
    private User user;

    @ManyToOne
    @Getter @Setter
    private Monitoring monitoring;

    public Follower(User user, Monitoring monitoring){
        this.followerType = FollowerType.RELATIVE;
        this.isAdmin=false;
        this.user=user;
        this.monitoring= monitoring;
    }

    public Follower(User user, Monitoring monitoring, boolean isAdmin){
        this.followerType = FollowerType.RELATIVE;
        this.isAdmin=isAdmin;
        this.user=user;
        this.monitoring= monitoring;
    }

    public Follower(){
    }
}
