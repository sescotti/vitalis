package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

/**
 * Created by sscotti on 10/19/16.
 */
@Data
public class MonitoringDto {

    private Date startDate;

    private Date finishDate;

    private ModuleDto module;

    private UserDto patient;

    private Collection<SensorDto> sensors;

    public MonitoringDto(){ }

    public MonitoringDto(Monitoring monitoring) {
        this.startDate = monitoring.getStartDate();
        this.finishDate = monitoring.getFinishDate();
        this.module = monitoring.getModule() != null ? new ModuleDto(monitoring.getModule()) : null;
        this.patient = new UserDto(monitoring.getPatient());
        this.sensors = monitoring.getSensors().stream().map(SensorDto::new).collect(toList());
    }
}
