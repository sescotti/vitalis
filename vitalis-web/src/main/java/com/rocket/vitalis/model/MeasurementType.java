package com.rocket.vitalis.model;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;


/**
 * Created by Ailin on 21/08/2016.
 */
@RequiredArgsConstructor
public enum MeasurementType {

    TEMPERATURE("temperature"),
    HEART_RATE("heart_rate"),
    RESPIRATORY_RATE("respiratory_rate"),
    BLOOD_OXYGEN("blood_oxygen"),
    ECG("ecg"),
    BLOOD_PRESSURE("blood_pressure");


    public static MeasurementType fromString(String code){
        for (MeasurementType type: values()){
            if(type.code.equals(code)){
                return type;
            }
        }
        return null;
    }

    @Override
    @JsonValue
    public String toString() {
        return this.code;
    }

    @NonNull
    String code;


}
