//package com.rocket.vitalis.repositories;
//
//import com.rocket.vitalis.model.AccessToken;
//import org.hibernate.SessionFactory;
//import org.hibernate.criterion.Projections;
//import org.hibernate.criterion.Restrictions;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
//import org.springframework.stereotype.Repository;
//
//import javax.persistence.EntityManager;
//import javax.persistence.EntityManagerFactory;
//
///**
// * Created by sscotti on 10/9/16.
// */
//@Repository
//public abstract class AccessTokenRepositoryImpl extends SimpleJpaRepository<AccessToken, String> implements AccessTokenRepository {
//
//    @Autowired
//    private SessionFactory sessionFactory;
//
//    public AccessTokenRepositoryImpl(Class<AccessToken> domainClass, EntityManager em) {
//        super(domainClass, em);
//    }
//
//    public Long getUserId(String token){
//        return (Long) sessionFactory.getCurrentSession()
//                .createCriteria(AccessToken.class)
//                .setProjection(Projections.property("user_id"))
//                .add(Restrictions.eq("token", token))
//                .uniqueResult();
//    }
//}
