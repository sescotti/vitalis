package com.rocket.vitalis.utils;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

/**
 * Created by sscotti on 10/25/16.
 */
public class FileUtils {

    public static Map<String, String> readJson(String filename) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = FileUtils.class.getResourceAsStream(filename);
        return mapper.readValue(is, Map.class);
    }
}
