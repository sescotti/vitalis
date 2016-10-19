package com.rocket.vitalis.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * Created by Sebastian on 25/9/2016.
 */
@RequiredArgsConstructor
public enum SensorStatus {

    ENABLED("enabled"), DISABLED("disabled"), PAUSED("paused");

    @NonNull
    String sensorStatus;

    @Override
    @JsonValue
    public String toString() {
        return sensorStatus;
    }
}
