package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Delegate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by sscotti on 8/10/16.
 */
@Entity
@RequiredArgsConstructor
public class User {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column(nullable = false, unique = true)
    @Getter @Setter @NonNull
    private String email;

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private String password;

    @Embedded
    @Delegate
    private Profile profile = new Profile();

    // Required by Hibernate
    protected User(){}

}
