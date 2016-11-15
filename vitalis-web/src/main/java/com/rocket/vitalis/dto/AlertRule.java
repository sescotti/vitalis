package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.Alert;
import com.rocket.vitalis.model.Measurement;
import lombok.AllArgsConstructor;
import lombok.Getter;

import static com.rocket.vitalis.dto.AlertRule.RuleSource.DEFAULT;
import static com.rocket.vitalis.dto.AlertRule.RuleSource.USER;

/**
 * Created by sscotti on 11/12/16.
 */
@Getter
@AllArgsConstructor
public class AlertRule {

    private double      from;
    private double      to;
    private RuleSource  type    = DEFAULT;
    private Alert       source;


    public boolean matches(Measurement measurement) {
        Double value = measurement.getValue();
        return value >= this.from && value <= this.to;
    }

    public enum RuleSource {
        DEFAULT, USER
    }

    public AlertRule(Alert alert){
        this.from = alert.getFrom();
        this.to = alert.getTo();
        this.source = alert;
        this.type = USER;
    }
}



