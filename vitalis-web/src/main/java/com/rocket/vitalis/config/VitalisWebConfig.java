package com.rocket.vitalis.config;

import com.rocket.vitalis.web.VitalisAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.Filter;

/**
 * Created by sscotti on 8/11/16.
 */
@Configuration
//@EnableWebMvc
public class VitalisWebConfig {

    @Bean
    public Filter shallowEtagHeaderFilter() {
        return new VitalisAuthenticationFilter();
    }

}
