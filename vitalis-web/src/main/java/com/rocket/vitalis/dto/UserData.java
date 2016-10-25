package com.rocket.vitalis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import com.rocket.vitalis.model.BloodFactor;
import com.rocket.vitalis.model.BloodType;
import com.rocket.vitalis.model.DocumentType;

/**
  * Created by sscotti on 8/10/16.
*/
@Data
@AllArgsConstructor
public class UserData {

    private String          name;
    private DocumentType    documentType;
    private String          docNumber;
    private BloodFactor     bloodFactor;
    private BloodType       bloodType;
}