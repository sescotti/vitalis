package com.rocket.vitalis.config;

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.ImprovedNamingStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.util.Properties;

/**
 * Created by sscotti on 8/9/16.
 */
@Configuration
@EnableTransactionManagement
@PropertySource({"classpath:config/hibernate.properties"})
//@ComponentScan({"com.rocket.vitalis.model"})
public class HibernateConfig {

    @Autowired
    private Environment env;


    @Bean
    public LocalSessionFactoryBean sessionFactory() {
        LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setDataSource(h2DataSource());
        sessionFactory.setPackagesToScan(new String[] { "com.rocket.vitalis.model" });
        sessionFactory.setHibernateProperties(hibernateProperties());
        sessionFactory.setNamingStrategy(ImprovedNamingStrategy.INSTANCE);

        return sessionFactory;
    }


    public DataSource restDataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName(env.getProperty("jdbc.driverClassName"));
        dataSource.setUrl(env.getProperty("jdbc.url"));
        dataSource.setUsername(env.getProperty("jdbc.user"));
        dataSource.setPassword(env.getProperty("jdbc.pass"));

        return dataSource;
    }

    @Bean
    public DataSource h2DataSource(){
        // no need shutdown, EmbeddedDatabaseFactoryBean will take care of this
        return   new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                        .setName("vitalis")
//                .addScript("db/sql/create-db.sql")
//                .addScript("db/sql/insert-data.sql")
                .build();
    }
    @Bean
    @Autowired
    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) {
        HibernateTransactionManager txManager = new HibernateTransactionManager();
        txManager.setSessionFactory(sessionFactory);

        return txManager;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    Properties hibernateProperties() {
        return new Properties() {
            {
                setProperty("hibernate.hbm2ddl.auto", env.getProperty("hibernate.hbm2ddl.auto"));
                setProperty("hibernate.dialect", env.getProperty("hibernate.dialect"));
                setProperty("hibernate.globally_quoted_identifiers", "true");
            }
        };
    }

    @PostConstruct
    public void startDBManager() {
        new EmbeddedH2Console().start();
    }
}
