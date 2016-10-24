package com.rocket.vitalis.model;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Delegate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by Ailin on 21/08/2016.
 */
@Entity
public class Module extends AbstractModel {

    @Column(nullable = false, unique = true)
    @Getter @Setter @NonNull
    private String serialNumber;

    @ManyToOne
    @Getter @Setter
    private User owner;

    @OneToOne(mappedBy = "module")
    @Getter @Setter
    private Monitoring monitoring;

    public Module(String serialNumber, User owner){
        this.serialNumber= serialNumber;
        this.owner =  owner;
    }

    public Module(){}
}
