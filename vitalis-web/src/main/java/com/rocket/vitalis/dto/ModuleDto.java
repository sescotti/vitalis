package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.Module;
import com.rocket.vitalis.model.Monitoring;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Created by sscotti on 10/21/16.
 */
@Data
@AllArgsConstructor
public class ModuleDto {

    private Module module;
    private Monitoring monitoring;

}
