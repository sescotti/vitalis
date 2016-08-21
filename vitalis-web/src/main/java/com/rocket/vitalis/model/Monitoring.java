package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.format.DateTimeFormatter;

/**
 * Created by Ailin on 21/08/2016.
 */
@Entity
@RequiredArgsConstructor
public class Monitoring {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column
    @Getter @Setter
    private DateTimeFormatter startDate;

    @Column
    @Getter @Setter
    private DateTimeFormatter finishDate;

    /* Relacion con un Modulo*/
    @Column
    @Getter @Setter
    private Long idModule;

    /* Relacion con un User- que sera el paciente*/
    @Column
    @Getter @Setter
    private Long idPatient;
}
