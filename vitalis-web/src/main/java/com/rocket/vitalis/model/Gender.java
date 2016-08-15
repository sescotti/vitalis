package com.rocket.vitalis.model;

import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * Created by sscotti on 8/15/16.
 */
@RequiredArgsConstructor
public enum Gender {
    MALE("male"), FEMALE("female");

    @NonNull
    String gender;
}
