package com.rocket.vitalis.config;

import lombok.extern.log4j.Log4j;
import org.h2.tools.Server;

import java.sql.SQLException;

/**
 * Created by sscotti on 8/11/16.
 */
@Log4j
public class EmbeddedH2Console {

    private static Integer port = null;

    private static Server console;

    public static void start() {
        if(console != null){
            return ;
        }
        try {
            for (Integer i = 8082; (i < 10000 && port == null); i++) {
                try {
                    console = org.h2.tools.Server.createWebServer("-webPort", i.toString());
                    console.start();
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

    public static void stop(){
        if(console != null){
            log.info("Stopping H2 web console");
            console.stop();
        }
    }

}
