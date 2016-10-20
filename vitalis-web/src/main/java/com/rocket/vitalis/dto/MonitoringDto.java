package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import java.util.Collection;
import java.util.Date;

/**
 * Created by sscotti on 10/19/16.
 */
@Data
public class MonitoringDto {

    private Date startDate;

    private Date finishDate;

    private Module module;

    private User patient;

    Collection<SensorDto> sensors;
}
