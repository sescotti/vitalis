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
@RequiredArgsConstructor
public class Measurement {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column
    @Getter @Setter
    private Date measurementDate;

    @Column(nullable = false)
    @Getter @Setter @NonNull
    private Double value;

    @Column
    @Getter @Setter
    private MeasurementType measurementType;

    /*DEBE ESTAR RELACIONADO CON Monitoring*/
    @OneToOne
    @Getter @Setter
    private Monitoring idMonitoring;

    public Measurement(MeasurementType measureTypeString, Double value ){
        this.measurementType = measureTypeString;
        this.value=value;
        this.measurementDate = new Date();
    }

    protected Measurement(){}

}
