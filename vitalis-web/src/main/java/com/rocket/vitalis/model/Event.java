package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Sebastian on 25/9/2016.
 */

@Entity
public class Event extends AbstractModel {

    @Column
    @Getter @Setter
    private Date dateTime;

    @Column
    @Getter @Setter
    private EventStatus eventStatus;

    /*
    DEBE ESTAR RELACIONADO CON Monitoring, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private Monitoring monitoring;

    /*
    DEBE ESTAR RELACIONADO CON Alert, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private Alert alert;

}
