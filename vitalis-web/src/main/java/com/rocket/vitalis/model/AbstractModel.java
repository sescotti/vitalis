package com.rocket.vitalis.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.util.Date;

/**
 * Created by sscotti on 10/12/16.
 */
@Data
@MappedSuperclass
public abstract class AbstractModel {

    @Id
    @GeneratedValue
    private Long    id;

    @CreationTimestamp
    private Date    creationDate;

    @UpdateTimestamp
    private Date    lastModifiedDate;

}
