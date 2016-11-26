package com.rocket.vitalis.dto;

import lombok.Data;

/**
 * Created by Ailin on 21/10/2016.
 */
@Data
public class AlertRequest {
    private Long monitoringId;
    private String measurementType;
    private Double from;
    private Double to;
    private Double fromSecondary;
    private Double toSecondary;

}
