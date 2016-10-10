package com.rocket.vitalis.dto;

import com.rocket.vitalis.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Created by sscotti on 10/8/16.
 */
@Data
@AllArgsConstructor
public class Profile {

    private Long    id;
    private String  name;
    private String  pictureUrl;
    private String  email;

    public Profile(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.pictureUrl = user.getPictureUrl();
        this.email = user.getEmail();
    }
}
