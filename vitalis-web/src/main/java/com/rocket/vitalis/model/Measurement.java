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
public class Measurement extends AbstractModel {

    @Column
    @Getter @Setter @NonNull
    private Date measurementDate;

    @Column(nullable = false, precision = 3, scale = 1)
    @Getter @Setter @NonNull
    private Double value;

    /**
     * Para el caso de presión que es un valor compuesto
     */
    @Column(precision = 3, scale = 1)
    @Getter @Setter
    private Double valueSecondary;

    @Column
    @Getter @Setter
    private MeasurementType type;

    /*
    DEBE ESTAR RELACIONADO CON Monitoring, relación *-1
    */
    @ManyToOne
    @Getter @Setter @NonNull
    private Monitoring monitoring;

    protected Measurement(){}

    public Measurement(Monitoring monitoring, Date measureDate, MeasurementType type, Double value){
        this(monitoring, measureDate, type, value, null);
    }

    public Measurement(Monitoring monitoring, Date measureDate, MeasurementType type, Double value, Double valueSecondary){
        this.monitoring = monitoring;
        this.type = type;
        this.value=value;
        this.valueSecondary = valueSecondary;
        this.measurementDate = measureDate;
    }

}
