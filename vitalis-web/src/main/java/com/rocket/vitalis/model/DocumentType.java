package com.rocket.vitalis.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * Created by Sebastian on 25/9/2016.
 */

@RequiredArgsConstructor
public enum DocumentType {

    DNI("dni"), CI("ci"), LE("le"), LC("lc");

    @NonNull
    String eventStatus;

    @Override
    @JsonValue
    public String toString() {
        return this.name().toLowerCase();
    }

}
