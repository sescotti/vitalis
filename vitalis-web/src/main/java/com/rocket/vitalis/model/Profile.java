package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import sun.misc.FormattedFloatingDecimal;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.text.DecimalFormat;
import java.util.Date;

/**
 * Created by sscotti on 8/15/16.
 */
@Embeddable
public class Profile {

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

}
