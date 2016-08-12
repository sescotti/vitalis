package com.rocket.vitalis.web.controller.api.module;

import com.rocket.vitalis.config.EmbeddedH2Console;
import com.rocket.vitalis.dto.MeasureRequest;
import com.rocket.vitalis.model.User;
import lombok.extern.log4j.Log4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.PreDestroy;

/**
 * Created by sscotti on 8/11/16.
 */
@RestController
@RequestMapping(value = "/api/measures", consumes = "application/json", produces = "application/json")
@Log4j
public class MeasureController {

    @RequestMapping(value = "/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public Object postMeasure(@PathVariable("userId") Long userId, @RequestBody MeasureRequest request){

        log.info("Received + " + request);

        User user = new User();
        user.setId(1000L);
        user.setName("Sarasa");
        user.setNickName("Sarasa_001");

        return user;
    }

}
