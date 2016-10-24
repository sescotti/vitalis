package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.Monitoring;
import com.rocket.vitalis.model.User;
import lombok.*;

import javax.persistence.Column;
import javax.persistence.ManyToOne;

/**
 * Created by sscotti on 10/21/16.
 */
@Data
@AllArgsConstructor
public class ModuleDto {

    private String serialNumber;
    private UserDto owner;

    public ModuleDto(Module module){
        this.serialNumber = module.getSerialNumber();
        this.owner = new UserDto(module.getOwner());
    }
}
