package com.rocket.vitalis.config;

import lombok.extern.log4j.Log4j;

/**
 * Created by sscotti on 8/11/16.
 */
@Log4j
public class EmbeddedH2Console {

    private Integer	port	= null;

    public void start() {
        try {
            for (Integer i = 8082; (i < 10000 && port == null); i++) {
                try {
                    org.h2.tools.Server.createWebServer("-webPort", i.toString()).start();
                    port = i;
                    log.info("Starting H2 web console in port: " + port);
                } catch (Exception e) {
                }

            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Integer getPort() {
        return this.port;
    }

}
