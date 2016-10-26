package com.rocket.vitalis.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by sscotti on 10/20/16.
 */
public class PicturesMocks {

    private static Map<String, String> picturesMap = new HashMap<>();

    static {
        picturesMap.put("sebastians@vitalis.com", "/img/sebas.jpg");
        picturesMap.put("ailin@vitalis.com", "/img/ailin.jpg");
        picturesMap.put("sebastianp@vitalis.com", "/img/sebap.jpg");
        picturesMap.put("aldo@vitalis.com", "/img/aldo.jpg");
        picturesMap.put("mariano@vitalis.com", "/img/mariano.jpg");
        picturesMap.put("sancho@vitalis.com", "/img/sancho.png");
    }

    public static String getPictureUrl(String mail){
        return picturesMap.get(mail);
    }
}
