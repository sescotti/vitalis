package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.*;

/**
 * Created by Sebastian on 25/9/2016.
 */

@Entity
public class Sensor {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private MeasurementType measurementType;

    @Column
    @Getter @Setter
    private SensorStatus sensorStatus;



}
