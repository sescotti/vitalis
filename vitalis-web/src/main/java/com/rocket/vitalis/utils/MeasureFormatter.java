package com.rocket.vitalis.utils;

import com.rocket.vitalis.model.Measurement;
import com.rocket.vitalis.model.MeasurementType;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static com.rocket.vitalis.model.MeasurementType.*;

/**
 * Created by sscotti on 11/17/16.
 */
@Component
public class MeasureFormatter {

    private static Map<MeasurementType, FormatDecorator> formatters = new HashMap<>();

    static {
        formatters.put(TEMPERATURE,         new TemperatureFormatDecorator());
        formatters.put(HEART_RATE,          new HeartRateFormatDecorator());
        formatters.put(RESPIRATORY_RATE,    new RespiratoryRateFormatDecorator());
        formatters.put(BLOOD_OXYGEN,        new BloodOxygenFormatDecorator());
//        formatters.put(ECG,                 new ECGFormatDecorator());
        formatters.put(BLOOD_PRESSURE,      new BloodPressureFormatDecorator());
    }

    public String getFormattedValue(Measurement measurement){
        return formatters.get(measurement.getType()).format(measurement);
    }

    private interface FormatDecorator {
        String format(Measurement measurement);
    }

    private static class TemperatureFormatDecorator implements FormatDecorator {
        public String format(Measurement measurement) {
            return measurement.getValue() + "º";
        }
    }

    private static class HeartRateFormatDecorator implements FormatDecorator {
        public String format(Measurement measurement) {
            return measurement.getValue() + "bpm";
        }
    }

    private static class RespiratoryRateFormatDecorator implements FormatDecorator {
        public String format(Measurement measurement) {
            return measurement.getValue() + "rpm";
        }
    }

    private static class BloodOxygenFormatDecorator implements FormatDecorator {
        public String format(Measurement measurement) {
            return measurement.getValue() + "%";
        }
    }

//    private static class ECGFormatDecorator implements FormatDecorator {
//        public String format(Measurement measurement) {
//            return measurement.getValue() + "";
//        }
//    }

    private static class BloodPressureFormatDecorator implements FormatDecorator {
        public String format(Measurement measurement) {
            return measurement.getValue() + "/" + measurement.getValueSecondary();
        }
    }

}
