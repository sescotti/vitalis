package com.rocket.vitalis.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * Created by sscotti on 8/10/16.
 */
@Entity
public class User {

    @Id
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String nickName;


}
