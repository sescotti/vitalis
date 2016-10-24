package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.AbstractModel;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

/**
 * Created by sscotti on 10/23/16.
 */
@Data
public abstract class AbstractDto {

    private Long    id;

    private Date    creationDate;

    private Date    lastModifiedDate;

    public AbstractDto(){}

    public AbstractDto(AbstractModel model){
        this.id = model.getId();
        this.creationDate = model.getCreationDate();
        this.lastModifiedDate = model.getLastModifiedDate();
    }

}
