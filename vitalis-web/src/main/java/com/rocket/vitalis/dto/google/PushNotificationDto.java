package com.rocket.vitalis.dto.google;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Created by sscotti on 11/14/16.
 */
@Data
@AllArgsConstructor
public class PushNotificationDto {

    private String                  to;
    private PushNotificationData    data;

    @Data
    public static class PushNotificationData {
        private String  message;
        private String  title;
        private String  image;
        private int     sound;
        private int     vibrate;
        private String  style;
        private String  summaryText;
    }
}
