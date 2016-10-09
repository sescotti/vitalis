package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Delegate;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;

import static javax.persistence.FetchType.EAGER;

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

    @Column
    @Getter @Setter
    private UserType userType;

    @Column
    @Getter @Setter
    private Boolean isDoctor;

    /*
    DEBE ESTAR RELACIONADO CON Clinic, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private Clinic clinic;

    @Column
    @Getter @Setter
    private String name;

    @Column
    @Getter @Setter
    private Gender gender;

    @Column
    @Getter @Setter
    private Date birthDate;

    @Column
    @Getter @Setter
    private Double height;

    @Column
    @Getter @Setter
    private String docNumber;

    @Column
    @Getter @Setter
    private Double weight;

    @Column
    @Getter @Setter
    private BloodFactor bloodFactor;

    @Column
    @Getter @Setter
    private BloodType bloodType;

    @Column
    @Getter @Setter
    private String pictureUrl;

    @OneToMany(fetch = EAGER)
    @Getter @Setter
    private Collection<User> following = new LinkedList<>();

    // Required by Hibernate
    protected User(){}

}
