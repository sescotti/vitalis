package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.AbstractModel;
import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.Monitoring;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.util.Date;

/**
 * Created by sscotti on 10/19/16.
 *
 * Clase para devolver en el json y que sea compatible las métricas de valores simples como compuestas
 */
@Data
@AllArgsConstructor
public class MeasurementDto {

    private Date measurementDate;

    private Object value;

    private MeasurementType type;

    private Monitoring monitoring;

    protected MeasurementDto(){}

}
