package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private String name;

    @Column(nullable = false, unique = true)
    @Getter @Setter @NonNull
    private String email;

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private String password;

    @Column
    @Getter @Setter
    private Date birthDate;

    // Required by Hibernate
    protected User(){}

}
