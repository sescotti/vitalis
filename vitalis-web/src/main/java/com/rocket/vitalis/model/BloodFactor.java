package com.rocket.vitalis.model;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


/**
 * Created by Ailin on 21/08/2016.
 */
@RequiredArgsConstructor
public enum BloodFactor {
    RHPositivo("RHP"), RHNegativo("RHN");

    @NonNull
    String bloodFactor;

}


