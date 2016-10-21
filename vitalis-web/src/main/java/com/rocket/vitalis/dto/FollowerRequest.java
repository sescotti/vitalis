package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.RequestStatus;
import lombok.Data;

/**
 * Created by Ailin on 20/10/2016.
 */
@Data
public class FollowerRequest {
    private Long requestId;
    private RequestStatus status;
}
