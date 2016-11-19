package com.rocket.vitalis.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * Created by sscotti on 11/12/16.
 */
@Entity
@Data
@AllArgsConstructor
public class DeviceToken extends AbstractModel {

    @ManyToOne
    private AccessToken session;

    @Column(nullable = false)
    private String token;

    protected DeviceToken(){

    }
}
