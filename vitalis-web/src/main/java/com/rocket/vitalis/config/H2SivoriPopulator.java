package com.rocket.vitalis.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by sscotti on 10/26/16.
 */
@Configuration
@Profile("dev")
public class H2SivoriPopulator {

    @Autowired
    private AbstractApplicationContext context;

    @PostConstruct
    @Profile("dev")
    public void startDBManager() {
        EmbeddedH2Console.start();
        context.addApplicationListener(event -> EmbeddedH2Console.stop());
    }

}
