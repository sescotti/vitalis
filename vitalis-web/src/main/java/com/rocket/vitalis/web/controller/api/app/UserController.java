package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.Profile;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.UserService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

/**
 * Created by sscotti on 10/9/16.
 */
@RequestMapping("/api/app/user")
@Controller
public class UserController extends AbstractApiController {

	@Autowired
	private UserService userService;

	@RequestMapping(value = "/profile", method = GET)
	@ResponseBody
	public ResponseEntity<?> getProfile(@ModelAttribute("user") User user) {

		Profile profile = new Profile(user);
		return new ResponseEntity<Object>(profile, OK);
	}

	@RequestMapping(value = "/profile", method = { PUT, POST })
	@ResponseBody
	public ResponseEntity<?> save(@ModelAttribute("user") User user,
			@RequestBody User formUser) {

		user.setName(formUser.getName());
		user.setDocNumber(formUser.getDocNumber());
		user.setDocumentType(formUser.getDocumentType());
		user.setBloodFactor(formUser.getBloodFactor());
		user.setBloodType(formUser.getBloodType());
		user = userService.save(user);
		return new ResponseEntity<Object>(user, OK);
	}
}
