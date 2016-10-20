package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Sebastian on 25/9/2016.
 */

@Entity
@RequiredArgsConstructor
public class Request extends AbstractModel {

    @Column
    @Getter
    @Setter
    private RequestStatus requestStatus;

    @Column
    @Getter
    @Setter
    private Date requestDay;

    @Column
    @Getter
    @Setter
    private Date completionDay;

    @ManyToOne
    @Getter
    @Setter
    private User requestedBy;

    @ManyToOne
    @Getter
    @Setter
    private Monitoring monitoring;

    public Request(User user, Monitoring monitoring) {
        this.requestStatus = RequestStatus.PENDING;
        this.requestDay = new Date();
        this.requestedBy=user;
        this.monitoring=monitoring;
    }

}
