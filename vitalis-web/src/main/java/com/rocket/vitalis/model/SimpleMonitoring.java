package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.Column;
import java.util.Date;

/**
 * Created by Ailin on 19/10/2016.
 */
public interface SimpleMonitoring {
    Long getId();
    SimpleUser getPatient();
}
