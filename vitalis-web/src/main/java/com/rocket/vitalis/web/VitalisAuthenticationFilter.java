package com.rocket.vitalis.web;

import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.exceptions.InvalidTokenException;
import com.rocket.vitalis.model.User;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.regex.Pattern;

import static javax.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * Created by sscotti on 10/1/16.
 */
@Component
@Log4j
public class VitalisAuthenticationFilter implements Filter{

    private Pattern requestUrlsPatternMatcher;

    @Autowired
    private UserService userService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.requestUrlsPatternMatcher = Pattern.compile("/api/app.*");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse resp = (HttpServletResponse) servletResponse;
        resp.setHeader("Access-Control-Allow-Origin", "*");
        if(requestUrlsPatternMatcher.matcher(req.getRequestURI()).find()){

            String authToken = req.getHeader("X-Auth-Token");
            if(isBlank(authToken)){
                resp.sendError(SC_UNAUTHORIZED);
            } else {
                try {
                    User user = userService.getUser(authToken);
                    servletRequest.setAttribute("user", user);
                    filterChain.doFilter(servletRequest, servletResponse);
                } catch (InvalidTokenException e) {
                    log.error("Invalid token detected: ", e);
                    resp.sendError(SC_UNAUTHORIZED);
                }
            }
        } else {
            filterChain.doFilter(servletRequest, servletResponse);
        }



    }

    @Override
    public void destroy() {

    }
}
