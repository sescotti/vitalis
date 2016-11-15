package com.rocket.vitalis.exceptions;

import org.springframework.dao.DataIntegrityViolationException;

/**
 * Created by sscotti on 10/8/16.
 */
public class ModuleAlreadyRegisteredException extends Exception {

    public ModuleAlreadyRegisteredException(DataIntegrityViolationException cause) {
        super("module_already_registered", cause);
    }

}
