package com.rocket.vitalis.dto;

import lombok.Data;

/**
 * Created by sscotti on 8/13/16.
 */
@Data
public class SignupRequest extends LoginRequest {

    private String password2;

}