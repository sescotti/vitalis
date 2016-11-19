package com.rocket.vitalis.web.controller.api;

import com.rocket.vitalis.model.*;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.beans.PropertyChangeListener;
import java.beans.PropertyEditor;
import java.beans.PropertyEditorSupport;

/**
 * Created by sscotti on 10/8/16.
 */

public class AbstractApiController {

    @ModelAttribute("user")
    public User getUser(HttpServletRequest request){
        return (User) request.getAttribute("user");
    }

    @InitBinder
    public void initBinder(WebDataBinder binder){
        binder.registerCustomEditor(MeasurementType.class, new PropertyEditorSupport(){
            public void setAsText(String text) throws IllegalArgumentException {
                super.setValue(MeasurementType.fromString(text));
            }
        });

        binder.registerCustomEditor(RequestStatus.class, new PropertyEditorSupport(){
            public void setAsText(String text) throws IllegalArgumentException {
                super.setValue(RequestStatus.fromString(text));
            }
        });

        binder.registerCustomEditor(SensorStatus.class, new PropertyEditorSupport(){
            public void setAsText(String text) throws IllegalArgumentException {
                super.setValue(SensorStatus.fromString(text));
            }
        });

        binder.registerCustomEditor(NotificationStatus.class, new PropertyEditorSupport(){
            public void setAsText(String text) throws IllegalArgumentException {
                super.setValue(NotificationStatus.fromString(text));
            }
        });

    }
}
