package com.rocket.vitalis.model;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


/**
 * Created by Ailin on 21/08/2016.
 */
@RequiredArgsConstructor
public enum BloodFactor {
    RH_POSITIVE("RH+"), RH_NEGATIVE("RH-");

    @NonNull
    String bloodFactor;

    @Override
    @JsonValue
    public String toString() {
        return this.bloodFactor;
    }

}


