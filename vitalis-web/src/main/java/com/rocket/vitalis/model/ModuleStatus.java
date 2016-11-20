package com.rocket.vitalis.model;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Created by sscotti on 11/19/16.
 */
public enum ModuleStatus {
    ENABLED("enabled"), DISABLED("disabled");

    String code;

    ModuleStatus(String code){
        this.code = code;
    }

    @Override
    @JsonValue
    public String toString() {
        return code;
    }
}
