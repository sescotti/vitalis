package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.Alert;
import com.rocket.vitalis.model.Measurement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import static com.rocket.vitalis.dto.AlertRule.RuleSource.DEFAULT;
import static com.rocket.vitalis.dto.AlertRule.RuleSource.USER;

/**
 * Created by sscotti on 11/12/16.
 */
@Getter
@RequiredArgsConstructor
public class AlertRule {

    @NonNull
    private double      from;
    @NonNull
    private double      to;

    private double      fromSecondary;
    private double      toSecondary;

    @NonNull
    private RuleSource  type    = DEFAULT;

    @NonNull
    private Alert       source;


    public boolean matches(Measurement measurement) {
        Double  value = measurement.getValue();
        Double  valueSecondary = measurement.getValueSecondary();
        return  value >= this.from && value <= this.to ||
                valueSecondary != null && valueSecondary >= this.fromSecondary && valueSecondary <= this.toSecondary;
    }

    public enum RuleSource {
        DEFAULT, USER
    }

    public AlertRule(Alert alert){
        this.from = alert.getFrom();
        this.to = alert.getTo();
        this.fromSecondary = alert.getFromSecondary();
        this.toSecondary = alert.getToSecondary();
        this.source = alert;
        this.type = USER;
    }

    public AlertRule(double from, double to, RuleSource type){
        this.from = from;
        this.to = to;
        this.type = type;
    }

    public AlertRule(double from, double to, double fromSecondary, double toSecondary, RuleSource type){
        this(from,to,type);
        this.fromSecondary = fromSecondary;
        this.toSecondary = toSecondary;
        this.type = type;
    }

}



