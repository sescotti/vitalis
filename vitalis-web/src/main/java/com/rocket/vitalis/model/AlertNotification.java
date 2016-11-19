package com.rocket.vitalis.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;

import static javax.persistence.EnumType.STRING;

/**
 * Created by sscotti on 11/17/16.
 */
@Entity
@Data
@AllArgsConstructor
public class AlertNotification extends AbstractModel {

    @ManyToOne(optional = false)
    private Monitoring monitoring;

    @Column(nullable = false)
    private MeasurementType measurementType;

    @Column(nullable = false)
    private Double value;

    @Column
    private Double valueSecondary;

    @Column(nullable = false)
    @Enumerated(STRING)
    private NotificationStatus status;

    @ManyToOne
    private User owner;

    protected AlertNotification(){}

    public AlertNotification(Measurement measurement, User owner, NotificationStatus status){
        this.monitoring         = measurement.getMonitoring();
        this.measurementType    = measurement.getType();
        this.value              = measurement.getValue();
        this.valueSecondary     = measurement.getValueSecondary();
        this.status             = status;
        this.owner              = owner;
    }
}
