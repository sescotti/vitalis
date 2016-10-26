package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.Monitoring;
import lombok.Data;

import java.util.Collection;
import java.util.Date;

import static java.util.stream.Collectors.toList;

/**
 * Created by sscotti on 10/21/16.
 */
@Data
public class ModuleDto extends AbstractDto {

    private String          serialNumber;
    private UserDto         owner;
    private MonitoringDto   monitoring;

    public ModuleDto(Module module){
        super(module);
        this.serialNumber   = module.getSerialNumber();
        this.owner          = new UserDto(module.getOwner());
    }

    public ModuleDto(Module module, Monitoring monitoring){
        super(module);
        this.serialNumber   = module.getSerialNumber();
        this.owner          = new UserDto(module.getOwner());
        this.monitoring     = monitoring != null ? new MonitoringDto(monitoring) : null;
    }

    /**
     * Created by sscotti on 10/19/16.
     */
    @Data
    public static class MonitoringDto extends AbstractDto {

        private Date startDate;

        private Date finishDate;

        private UserDto patient;

        private Collection<SensorDto> sensors;

        public MonitoringDto(){
            super();
        }

        public MonitoringDto(Monitoring monitoring) {
            super(monitoring);
            this.startDate = monitoring.getStartDate();
            this.finishDate = monitoring.getFinishDate();
            this.patient = new UserDto(monitoring.getPatient());
            this.sensors = monitoring.getSensors().stream().map(SensorDto::new).collect(toList());
        }

    }
}
