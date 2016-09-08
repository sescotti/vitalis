package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Delegate;

import javax.persistence.*;
import java.util.Date;


/**
 * Created by Ailin on 21/08/2016.
 */
@Entity
public class Monitoring {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column
    @Getter @Setter
    private Date startDate;

    @Column
    @Getter @Setter
    private Date finishDate;

    /*Relacion con Module*/
    @OneToOne
    @Getter @Setter
    private Module module;

    /*Relacion con User*/
    @OneToOne
    @Getter @Setter
    private User patient;
}
