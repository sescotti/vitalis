package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Sebastian on 25/9/2016.
 */


@Entity
public class Alert extends AbstractModel {

    @Column
    @Getter @Setter
    private MeasurementType measurementType;

    @Column
    @Getter @Setter
    private Date creationDay;

    @Column
    @Getter @Setter
    private Date lastUpdate;

    @Column
    @Getter @Setter
    private double from;

    @Column
    @Getter @Setter
    private double to;

    /*
    DEBE ESTAR RELACIONADO CON Monitoring, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private Monitoring monitoring;

    /*
    DEBE ESTAR RELACIONADO CON User, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private User createdBy;


}
