package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.Sensor;
import com.rocket.vitalis.model.SensorStatus;
import lombok.*;

import javax.persistence.Column;
import java.util.Date;

/**
 * Created by sscotti on 10/19/16.
 *
 * Clase para devolver en el json y que sea compatible las métricas de valores simples como compuestas
 */
@Data
@AllArgsConstructor
public class SensorDto {

    private MeasurementType measurementType;

    private SensorStatus status;

    private Date lastMonitoringDate;

    private Object lastValue;

    private Object lastValueSecondary;

    public SensorDto(){}

    public SensorDto(Sensor sensor){
        this.measurementType = sensor.getMeasurementType();
        this.status = sensor.getStatus();
        this.lastMonitoringDate = sensor.getLastMonitoringDate();
        this.lastValue = sensor.getLastValue();
        this.lastValueSecondary = sensor.getLastValueSecondary();
    }

    public static SensorDto fromPressureSensor(Sensor sensor){
        SensorDto sensorDto = new SensorDto();

        sensorDto.measurementType = sensor.getMeasurementType();
        sensorDto.status = sensor.getStatus();
        sensorDto.lastMonitoringDate = sensor.getLastMonitoringDate();
        sensorDto.lastValue = sensor.getLastValue().intValue();
        sensorDto.lastValueSecondary = sensor.getLastValueSecondary().intValue();

        return sensorDto;
    }
}
