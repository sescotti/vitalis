package com.rocket.vitalis.dto.google;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;

/**
 * Created by sscotti on 11/14/16.
 */
@Data
@AllArgsConstructor
public class PushNotificationResponse {

    private long    multicastId;
    private int     success;
    private int     failure;
    private int     canonicalIds;

    private Collection<PushNotificationResult> results;

    @Data
    @AllArgsConstructor
    public static class PushNotificationResult {
        private String messageId;

        public PushNotificationResult(){

        }
    }
}
