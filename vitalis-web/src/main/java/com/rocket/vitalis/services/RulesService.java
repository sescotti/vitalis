package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.AlertRule;
import com.rocket.vitalis.model.MeasurementType;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import static com.rocket.vitalis.dto.AlertRule.RuleSource.DEFAULT;

/**
 * Created by sscotti on 11/12/16.
 */
@Service
public class RulesService {

    private static Map<MeasurementType, Collection<AlertRule>> defaultRules;

    public Collection<AlertRule> getDefaultRules(MeasurementType measurementType) {
        if(defaultRules  == null){
            defaultRules = populateRules();
        }

        return defaultRules.get(measurementType);

    }

    private Map<MeasurementType, Collection<AlertRule>> populateRules() {
        defaultRules = new HashMap<>();

        defaultRules.put(MeasurementType.BLOOD_OXYGEN, getBloodOxygenRules());
        defaultRules.put(MeasurementType.BLOOD_PRESSURE, getBloodPressureRules());
        defaultRules.put(MeasurementType.HEART_RATE, getHeartRateRules());
        defaultRules.put(MeasurementType.RESPIRATORY_RATE, getRespiratoryRateRules());
        defaultRules.put(MeasurementType.TEMPERATURE, getTemperatureRules());

        return defaultRules;
    }

    private Collection<AlertRule> getTemperatureRules() {
        Collection<AlertRule> alertRules = new ArrayList<>();

        alertRules.add(new AlertRule(0d, 35d, DEFAULT, null));
        alertRules.add(new AlertRule(37.5d, 38.3d, DEFAULT, null));
        alertRules.add(new AlertRule(40.0d, 43d, DEFAULT, null));

        return alertRules;
    }

    private Collection<AlertRule> getRespiratoryRateRules() {
        Collection<AlertRule> alertRules = new ArrayList<>();

        alertRules.add(new AlertRule(0d, 9d, DEFAULT, null));
        alertRules.add(new AlertRule(31d, 999d, DEFAULT, null));

        return alertRules;
    }

    private Collection<AlertRule> getHeartRateRules() {
        Collection<AlertRule> alertRules = new ArrayList<>();

        alertRules.add(new AlertRule(0d, 14d, DEFAULT, null));
        alertRules.add(new AlertRule(31d, 999d, DEFAULT, null));

        return alertRules;

    }

    private Collection<AlertRule> getBloodOxygenRules() {
        Collection<AlertRule> alertRules = new ArrayList<>();

        alertRules.add(new AlertRule(88d, 94d, DEFAULT, null));
        alertRules.add(new AlertRule(100d, 100d, DEFAULT, null));

        return alertRules;

    }

    private Collection<AlertRule> getBloodPressureRules() {
        Collection<AlertRule> alertRules = new ArrayList<>();

//        alertRules.add(new AlertRule(0d, 14d, DEFAULT, null));
//        alertRules.add(new AlertRule(31d, 999d, DEFAULT, null));

        return alertRules;

    }
}
