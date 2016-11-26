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

    @Column
    @Getter @Setter
    private Double fromSecondary;

    @Column
    @Getter @Setter
    private Double toSecondary;

    @ManyToOne
    @Getter @Setter
    private Monitoring monitoring;

    @ManyToOne
    @Getter @Setter
    private User createdBy;

    public Alert(){}

    public Alert(MeasurementType measurementType, Monitoring monitoring, User user,
                 Double from, Double to, Double fromSecondary, Double toSecondary){
        this.measurementType = measurementType;
        this.monitoring = monitoring;
        this.creationDay = new Date();
        this.createdBy = user;
        this.from = from;
        this.to = to;
        this.fromSecondary = fromSecondary;
        this.toSecondary = toSecondary;
    }

}
