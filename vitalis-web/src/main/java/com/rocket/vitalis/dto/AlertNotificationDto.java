package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.NotificationStatus;
import lombok.Data;

/**
 * Created by sscotti on 11/19/16.
 */
@Data
public class AlertNotificationDto {
    private Long                id;
    private NotificationStatus  status;
}
