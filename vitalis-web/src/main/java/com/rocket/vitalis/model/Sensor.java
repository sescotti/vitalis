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
public class Sensor extends AbstractModel {

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private MeasurementType measurementType;

    @Column
    @Getter @Setter
    private SensorStatus status;

    @Column
    @Getter @Setter
    private Date lastMonitoringDate;

    @Column
    @Getter @Setter
    private Double lastValue;

    @Column
    @Getter @Setter
    private Double lastValueSecondary;

}
