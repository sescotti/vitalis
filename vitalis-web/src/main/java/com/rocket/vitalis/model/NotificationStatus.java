package com.rocket.vitalis.model;


import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Created by sscotti on 11/17/16.
 */
public enum NotificationStatus {

    OPEN("open"), ACKED("acked"), CLOSED("closed");

    private String status;

    NotificationStatus(String status){
        this.status = status;
    }

    @Override
    @JsonValue
    public String toString() {
        return status;
    }

    public static Object fromString(String statusCode) {
        for(NotificationStatus status : values()){
            if(status.status.equals(statusCode)){
                return status;
            }
        }
        return null;
    }
}
