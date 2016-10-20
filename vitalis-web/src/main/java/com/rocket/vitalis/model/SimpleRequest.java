package com.rocket.vitalis.model;

/**
 * Created by Sony on 19/10/2016.
 */
public interface SimpleRequest {
    Long getId();
    SimpleMonitoring getMonitoring();
    SimpleUser getRequestedBy();
}
