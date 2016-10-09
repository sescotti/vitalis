package com.rocket.vitalis.web.controller.api;

import com.rocket.vitalis.model.User;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by sscotti on 10/8/16.
 */

public class AbstractApiController {

    @ModelAttribute("user")
    public User getUser(HttpServletRequest request){
        return (User) request.getAttribute("user");
    }
}
