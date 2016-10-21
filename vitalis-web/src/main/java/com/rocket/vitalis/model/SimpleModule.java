package com.rocket.vitalis.model;

/**
 * Created by Ailin on 20/10/2016.
 */
public interface SimpleModule {
    Long getId();
    SimpleUser getPatient();
    Module getModule();
}
