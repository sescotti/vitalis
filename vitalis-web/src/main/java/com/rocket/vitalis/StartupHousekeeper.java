package com.rocket.vitalis;

import com.rocket.vitalis.utils.LoadDataBase;
import com.rocket.vitalis.utils.WarmupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * Created by sscotti on 10/9/16.
 */
@Component
@Profile("dev")
public class StartupHousekeeper implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private LoadDataBase warmupService;


    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        warmupService.initApplicationData();
    }
}
