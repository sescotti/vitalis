package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by Sebastian on 25/9/2016.
 */

@Entity
public class Clinic {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column
    @Getter @Setter
    private String name;

    @Column
    @Getter @Setter
    private String address;
}
