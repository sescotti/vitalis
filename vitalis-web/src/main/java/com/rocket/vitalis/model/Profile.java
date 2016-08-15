package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
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

}
