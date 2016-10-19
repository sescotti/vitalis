package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.Column;
import java.util.Date;

/**
 * Created by sscotti on 10/18/16.
 */
public interface SimpleMeasurement {

    Date getMeasurementDate();

    Double getValue();

    MeasurementType getType();
}
