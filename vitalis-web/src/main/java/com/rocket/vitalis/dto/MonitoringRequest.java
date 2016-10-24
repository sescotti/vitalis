package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.MeasurementType;
import com.rocket.vitalis.model.SensorStatus;
import lombok.Data;

import java.util.Collection;

/**
 * Created by Ailin on 21/10/2016.
 */
@Data
public class MonitoringRequest {

    private Collection<PatientDto> patient;
    private Collection<FollowerDto> followers;
    private Collection<SensorDto> sensors;

    @Data
    public static class PatientDto {
        private Long Id;
    }

    @Data
    public static class FollowerDto {
        private Long Id;
        private boolean isAdmin;
    }

    @Data
    public static class SensorDto {
        private MeasurementType type;
        private SensorStatus status;
    }

}
