package com.rocket.vitalis.utils;

import java.math.RoundingMode;
import java.util.Random;

import static java.math.BigDecimal.valueOf;

/**
 * Created by sscotti on 10/19/16.
 */
public class VitalisUtils {

    public static double randomDouble(Number min, Number max){
        Random r = new Random();
        double value =  min.doubleValue() + (max.doubleValue() - min.doubleValue()) * r.nextDouble();

        return valueOf(value)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    public static int randomInteger(Number min, Number max){
        Random r = new Random();
        return r.nextInt(max.intValue() - min.intValue() + 1) + min.intValue();
    }

}
