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

    TEMPERATURE("temperature"), HEART_RATE("heart_rate"), RESPIRATORY_RATE("respiratory_rate"),
    DIASTOLIC_PRESSURE("diastolic_pressure"), SYSTOLIC_PRESSURE("systolic_pressure"), BLOOD_OXYGEN("blood_oxygen"),
    SKIN_CONDUCTANCE("skin_conductance"), ECG("ecg");


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
