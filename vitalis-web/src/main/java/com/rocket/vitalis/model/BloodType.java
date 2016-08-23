package com.rocket.vitalis.model;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;


/**
 * Created by Ailin on 21/08/2016.
 */
@RequiredArgsConstructor
public enum BloodType {
    A("a"), B("b"), AB("ab"), ZERO("0");

    @NonNull
    String bloodType;

}


