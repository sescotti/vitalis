package com.rocket.vitalis.model;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Delegate;

import javax.persistence.*;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * Created by Ailin on 21/08/2016.
 */
@Entity
@RequiredArgsConstructor
public class Module {

    @Id
    @GeneratedValue
    @Getter @Setter
    private Long id;

    @Column
    @Getter @Setter
    private DateTimeFormatter registrationDate;

    @Column
    @Getter @Setter
    private DateTimeFormatter updateDate;

}
