package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.format.DateTimeFormatter;
import java.time.format.DecimalStyle;

/**
 * Created by Ailin on 21/08/2016.
 */
@Entity
@RequiredArgsConstructor
public class Measuring {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column
    @Getter @Setter
    private DateTimeFormatter dateTime;

    @Column
    @Getter @Setter
    private DecimalStyle value;

    @Column
    @Getter @Setter
    private MeasuringType measuringType;

    /*DEBE ESTAR RELACIONADO CON Monitoring*/
    @Column
    @Getter @Setter
    private Long idMonitoring;
}
