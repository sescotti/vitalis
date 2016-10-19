package com.rocket.vitalis.model;

import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Delegate;

import javax.persistence.*;
import java.util.Collection;
import java.util.Date;
import static javax.persistence.CascadeType.*;

/**
 * Created by Ailin on 21/08/2016.
 */
@Entity
public class Monitoring extends AbstractModel {

    @Column
    @Getter @Setter
    private Date startDate;

    @Column
    @Getter @Setter
    private Date finishDate;

    /*
    DEBE ESTAR RELACIONADO CON Module, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private Module module;

    /*
    DEBE ESTAR RELACIONADO CON User, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private User patient;

    /*
    DEBE ESTAR RELACIONADO CON Sensor, relación *-*
    */
    @OneToMany(cascade = {MERGE, REMOVE, REFRESH, DETACH})
    @Getter @Setter
    private Collection<Sensor> sensors;

}
