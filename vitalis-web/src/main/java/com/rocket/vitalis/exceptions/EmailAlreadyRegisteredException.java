package com.rocket.vitalis.exceptions;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;

/**
 * Created by sscotti on 10/8/16.
 */
public class EmailAlreadyRegisteredException extends Exception {

    public EmailAlreadyRegisteredException(DataIntegrityViolationException e) {
        super(e);
    }
}
