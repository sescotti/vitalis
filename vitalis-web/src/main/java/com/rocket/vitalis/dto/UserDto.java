package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.*;
import lombok.Data;

import java.util.Date;

/**
 * Created by sscotti on 10/23/16.
 */
@Data
public class UserDto {

    private String email;

    private String password;

    private UserType userType;

    private Boolean isDoctor;

    private Clinic clinic;

    private String name;

    private Gender gender;

    private Date birthDate;

    private Integer height;

    private String docNumber;

    private Integer weight;

    private BloodFactor bloodFactor;

    private BloodType bloodType;

    private String pictureUrl;

    public UserDto(User user){
        this.email          = user.getEmail();
        this.password       = user.getPassword();
        this.userType       = user.getUserType();
        this.isDoctor       = user.getIsDoctor();
        this.clinic         = user.getClinic();
        this.name           = user.getName();
        this.gender         = user.getGender();
        this.birthDate      = user.getBirthDate();
        this.height         = user.getHeight();
        this.docNumber      = user.getDocNumber();
        this.weight         = user.getWeight();
        this.bloodFactor    = user.getBloodFactor();
        this.bloodType      = user.getBloodType();
        this.pictureUrl     = user.getPictureUrl();
    }
}
