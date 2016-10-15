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
    private String serial;

    /*
    DEBE ESTAR RELACIONADO CON User, relación *-1
    */
    @ManyToOne
    @Getter @Setter
    private User registeredBy;


    @Column
    @Getter @Setter
    private Date registrationDate;

    @Column
    @Getter @Setter
    private Date updateDate;

}
