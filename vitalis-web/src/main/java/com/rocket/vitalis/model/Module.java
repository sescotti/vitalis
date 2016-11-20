package com.rocket.vitalis.model;
import lombok.*;
import lombok.experimental.Delegate;

import javax.persistence.*;
import java.util.Date;

import static com.rocket.vitalis.model.ModuleStatus.ENABLED;

/**
 * Created by Ailin on 21/08/2016.
 */
@Entity
@Data
public class Module extends AbstractModel {

    @Column(nullable = false, unique = true)
    @NonNull
    private String serialNumber;

    @Column(nullable = false)
    @NonNull
    private ModuleStatus status = ENABLED;

    @ManyToOne
    private User owner;

    public Module(String serialNumber, User owner){
        this.serialNumber= serialNumber;
        this.owner =  owner;
    }

    public Module(){}
}
