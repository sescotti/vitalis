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
        private Long id;
    }

    @Data
    public static class FollowerDto {
        private Long id;
        private Boolean isAdmin;

        public FollowerDto(Long id, Boolean isAdmin){
            this.id = id;
            this.isAdmin = isAdmin;
        }

        public FollowerDto(){}
    }

    @Data
    public static class SensorDto {
        private MeasurementType type;
        private SensorStatus status;

        public SensorDto(MeasurementType type, SensorStatus status){
            this.type= type;
            this.status=status;
        }

        public SensorDto(){}
    }

}
