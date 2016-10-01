package com.rocket.vitalis.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import static org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType.H2;

/**
 * Created by sscotti on 8/9/16.
 */
@Log4j
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.rocket.vitalis.repositories")
@EntityScan(basePackages = "com.rocket.vitalis.model")
public class HibernateConfig {

    @Autowired
    private Environment env;

    @Autowired
    private AbstractApplicationContext context;

    @Bean
    @Profile("prod")
    public DataSource restDataSource() {
        HikariConfig config = new HikariConfig();

        config.setDriverClassName("org.postgresql.Driver");
        /*config.setDriverClassName(env.getProperty("jdbc.driverClassName"));*/
        config.setJdbcUrl(env.getProperty("spring.datasource.url"));
        config.setUsername(env.getProperty("spring.datasource.username"));
        config.setPassword(env.getProperty("spring.datasource.password"));

        return new HikariDataSource(config);
    }

    @Bean
    @Profile("dev")
    public DataSource h2DataSource() {
        // no need shutdown, EmbeddedDatabaseFactoryBean will take care of this
        return new EmbeddedDatabaseBuilder()
                .setType(H2)
                .setName("vitalis")
                .ignoreFailedDrops(true)
                .build();
    }

    @PostConstruct
    @Profile("dev")
    public void startDBManager() {
        EmbeddedH2Console.start();
        context.addApplicationListener(new ApplicationListener<ContextClosedEvent>() {
            @Override
            public void onApplicationEvent(ContextClosedEvent event) {
                EmbeddedH2Console.stop();
            }
        });

    }

}
