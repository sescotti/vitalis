package com.rocket.vitalis.model;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


/**
 * Created by Ailin on 21/08/2016.
 */
@RequiredArgsConstructor
public enum MeasurementType {

    TEMPERATURE("temperature"), HEART_RATE("heart_rate"), RESPIRATORY_RATE("respiratory_rate"),
    DIASTOLIC_PRESSURE("diastolic_pressure"), SYSTOLIC_PRESSURE("systolic_pressure"), BLOOD_OXYGEN("blood_oxygen"),
    SKIN_CONDUCTANCE("skin_conductance"), ECG("ecg");



    @NonNull
    String measurementType;

}
