package com.rocket.vitalis.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

import static java.time.LocalDateTime.now;
import static javax.persistence.FetchType.EAGER;
import static javax.persistence.FetchType.LAZY;

/**
 * Created by sscotti on 10/7/16.
 */
@Entity
@Data
@RequiredArgsConstructor
public class AccessToken {

    @Id
    @Column(nullable = false, unique = true, updatable = false)
    @NonNull
    private String  token;

    @ManyToOne(fetch = EAGER)
    @NonNull
    @JsonIgnore
    private User    user;

    @Column(nullable = false)
    @NonNull
    @JsonIgnore
    LocalDateTime expiresAt;

    // Required for Hibernate
    protected AccessToken(){}

    public boolean isExpired(){
        return now().isAfter(expiresAt);
    }
}
