package com.rocket.vitalis.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * Created by Sebastian on 25/9/2016.
 */

@RequiredArgsConstructor
public enum RequestStatus {

    ACCEPTED("accepted"), PENDING("pending"), REJECTED("rejected");

    @NonNull
    String requestStatus;

    @Override
    @JsonValue
    public String toString() {
        return requestStatus;
    }

    public static RequestStatus fromString(String status){
        for (RequestStatus type: values()){
            if(type.requestStatus.equals(status)){
                return type;
            }
        }
        return null;
    }


}
