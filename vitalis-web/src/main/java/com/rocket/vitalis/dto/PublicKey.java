package com.rocket.vitalis.dto;

import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * Created by sscotti on 10/8/16.
 */
@Data
@RequiredArgsConstructor
public class PublicKey {
    @NonNull
    private String token;
}
