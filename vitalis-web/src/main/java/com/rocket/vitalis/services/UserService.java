package com.rocket.vitalis.services;

import com.rocket.vitalis.dto.SignupRequest;
import com.rocket.vitalis.exceptions.EmailAlreadyRegisteredException;
import com.rocket.vitalis.exceptions.InvalidLoginException;
import com.rocket.vitalis.exceptions.InvalidTokenException;
import com.rocket.vitalis.model.AccessToken;
import com.rocket.vitalis.model.Follower;
import com.rocket.vitalis.model.SimpleMonitoring;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.repositories.AccessTokenRepository;
import com.rocket.vitalis.repositories.FollowerRepository;
import com.rocket.vitalis.repositories.MonitoringRepository;
import com.rocket.vitalis.repositories.UserRepository;
import com.rocket.vitalis.utils.PBKDF2Service;
import org.hibernate.exception.ConstraintViolationException;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;
import java.util.stream.StreamSupport;

import static com.rocket.vitalis.utils.PBKDF2Service.createHash;
import static com.rocket.vitalis.utils.PBKDF2Service.verifyPassword;
import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * Created by sscotti on 10/7/16.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccessTokenRepository accessTokenRepository;

    @Autowired
    private MonitoringRepository monitoringRepository;

    @Autowired
    private FollowerRepository followerRepository;

    private static final int TOKEN_TTL_IN_HS = 24;

    /**
     * Método que loguea al usuario y genera un token para
     * que lo use en los requests
     *
     * @param email     email con el que se loguea el usuario
     * @param password  contraseña del intento de login
     * @return token de sesión de autenticación
     * @throws InvalidLoginException en el caso de que el login sea inválido
     */
    public AccessToken login(String email, String password) throws InvalidLoginException {

        assertValueIsValid(email);
        assertValueIsValid(password);

        User user = userRepository.findByEmail(email);
        String pass = user == null ? "" : user.getPassword();

        boolean passwordMatches;
        try {
            passwordMatches = verifyPassword(password, pass);
        } catch (PBKDF2Service.CannotPerformOperationException e) {
            throw new IllegalStateException(e);
        } catch (PBKDF2Service.InvalidHashException e) {
            throw new InvalidLoginException("invalid_credentials");
        }

        if (!passwordMatches) {
            throw new InvalidLoginException("invalid_credentials");
        }

        return generateToken(user);

    }

    public void signup(SignupRequest request) throws EmailAlreadyRegisteredException {

        assertValueIsValid(request.getEmail());
        assertValueIsValid(request.getPassword());
        assertValueIsValid(request.getPassword2());
        assertPasswordsMatch(request);

        try {
            User user = createUser(request);

            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new EmailAlreadyRegisteredException(e);
        }

    }

    private User createUser(SignupRequest request) {
        String hash;

        try {

            hash = createHash(request.getPassword());
            User user = new User(request.getEmail(), hash);

            // FIXME: Estos son datos para mostrar algo, pero tenemos que cambiarlo
            user.setName("Sancho Panza");
            user.setPictureUrl("https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xlf1/v/t1.0-9/14611023_10154547018059144_1423955428690896778_n.jpg?oh=bb89db306ebc7c4adea5dcbe2298a149&oe=586C74AC&__gda__=1487668243_e7c6ae65113c49801bc756274701ffdb");

            return user;

        } catch (PBKDF2Service.CannotPerformOperationException e) {
            throw new IllegalStateException(e);
        }
    }

    public User getUser(String token) throws InvalidTokenException {

//        Long userId = accessTokenRepository.getUserId(token);
        AccessToken accessToken = accessTokenRepository.findByToken(token);

        if(accessToken == null){
            throw new InvalidTokenException("token_not_found");
        }

        if(LocalDateTime.now().isAfter(accessToken.getExpiresAt())){
            throw new InvalidTokenException("token_expired");
        }

        return accessToken.getUser();
    }

    private AccessToken generateToken(User user) {
        LocalDateTime localDateTime = LocalDateTime.now().plusHours(TOKEN_TTL_IN_HS);
        AccessToken token = new AccessToken("VTL_USR-" + UUID.randomUUID().toString(),user, localDateTime);

        return accessTokenRepository.save(token);
    }

//    @Transactional
//    public Collection<User> getFollowing(User user) {
//        userRepository.
//        return user.getFollowing();
//
//    }

    private void assertPasswordsMatch(SignupRequest request) {
        if(!request.getPassword().equals(request.getPassword2())){
            throw new IllegalArgumentException("passwords_mismatch");
        }
    }

    private void assertValueIsValid(String value){
        if(isBlank(value)){
            throw new IllegalArgumentException("incomplete_credentials");
        }
    }


    public User getUser(Long userId){
        return userRepository.findOne(userId);
    }


    public Collection<User> findPatientsLikeWithOutMonitoring(String userName){
        /* Todos los usuarios */
        Collection<User> users = userRepository.findByNameContainingIgnoreCase(userName);
        Collection<User> collectionUsers = new ArrayList<User>();
        users.forEach(collectionUsers::add);

        /* Los usuarios que tienen monitoreos*/
        Collection<SimpleMonitoring> monitorings = monitoringRepository.findByFinishDateIsNull();

        for (User item : users) {
            if (StreamSupport.stream(monitorings.spliterator(), false).anyMatch(miItem -> item.getId().equals(miItem.getPatient().getId())))
                collectionUsers.remove(item);
        }

        return collectionUsers;
    }


    public User setDoctor(Long userId){
        User user = userRepository.findOne(userId);
        user.setIsDoctor(true);
        userRepository.save(user);
        return user;
    }

}
