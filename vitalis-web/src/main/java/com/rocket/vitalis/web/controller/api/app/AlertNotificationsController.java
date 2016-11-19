package com.rocket.vitalis.web.controller.api.app;

import com.rocket.vitalis.dto.AlertNotificationDto;
import com.rocket.vitalis.model.Alert;
import com.rocket.vitalis.model.AlertNotification;
import com.rocket.vitalis.model.User;
import com.rocket.vitalis.services.AlertService;
import com.rocket.vitalis.web.controller.api.AbstractApiController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.AbstractController;

import java.util.AbstractCollection;
import java.util.Collection;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

/**
 * Created by sscotti on 11/19/16.
 */
@Controller
@RequestMapping(value ="/api/app/notifications", produces = "application/json")
public class AlertNotificationsController extends AbstractApiController {

    @Autowired
    private AlertService alertService;

    @RequestMapping({"/", ""})
    @ResponseBody
    public ResponseEntity<?> getNotifications(@ModelAttribute("user") User user){
        Collection<AlertNotification> notifications = alertService.getNotifications(user);
        return new ResponseEntity<>(notifications, OK);
    }

    @RequestMapping(value = {"/{notificationId}", ""}, method = PUT, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<?> update(@ModelAttribute("user") User user,
                                    @RequestBody AlertNotificationDto notification,
                                    @PathVariable("notificationId") Long notificationId){

        notification.setId(notificationId);
        AlertNotification updatedNotification = alertService.updateNotification(notification);
        return new ResponseEntity<>(updatedNotification, OK);
    }

}
