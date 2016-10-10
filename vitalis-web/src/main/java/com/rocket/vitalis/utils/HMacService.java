package com.rocket.vitalis.utils;

import org.apache.tomcat.util.codec.binary.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created by sscotti on 10/6/16.
 */
public class HMacService {

    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";

    public static String calculateRFC2104HMAC(String data, String key)
    {
        String result;
        try {

            // get an hmac_sha1 key from the raw key bytes
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), HMAC_SHA1_ALGORITHM);

            // get an hmac_sha1 Mac instance and initialize with the signing key
            Mac mac = Mac.getInstance(HMAC_SHA1_ALGORITHM);
            mac.init(signingKey);

            // compute the hmac on input data bytes
            byte[] rawHmac = mac.doFinal(data.getBytes());

            // base64-encode the hmac
            result = new String(Base64.encodeBase64(rawHmac), "UTF-8");


        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC : " + e.getMessage(),e);
        }
        return result;
    }

}
