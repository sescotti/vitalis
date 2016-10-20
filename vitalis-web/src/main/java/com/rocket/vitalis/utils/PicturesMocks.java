package com.rocket.vitalis.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by sscotti on 10/20/16.
 */
public class PicturesMocks {

    private static Map<String, String> picturesMap = new HashMap<>();

    static {
        picturesMap.put("sebastians@vitalis.com", "https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-9/13321745_10154178340059144_6375953951169924641_n.jpg?oh=d947fda977c1f25690f6ebe18721c2c7&oe=58616839&__gda__=1483568380_2f73224ebfe735922bd2bb150593bcf5");
        picturesMap.put("ailin@vitalis.com", "https://scontent-gru2-1.xx.fbcdn.net/v/t1.0-9/5347_1054019857995682_3889779951510681334_n.jpg?oh=3a08d9f2ea9e8ce5c5c025e376a3c752&oe=589E5CA5");
        picturesMap.put("sebastianp@vitalis.com", "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11045288_10206029105462702_4584767361088017524_n.jpg?oh=05232c2e3bb83c6e08443c91e00902c6&oe=58A7F485&__gda__=1483445623_bd6c8cce73d997c97eb88af39a67a150");
        picturesMap.put("aldo@vitalis.com", "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/1176314_10151820549257173_1914444078_n.jpg?oh=1b92f3f3880769d072f292876e7b894b&oe=58AB9BD1&__gda__=1483678478_b1cd8491dd634ca481de95148719402c");
        picturesMap.put("mariano@vitalis.com", "http://cdn.images.express.co.uk/img/dynamic/67/590x/Ramiro-Funes-Mori-599538.jpg");
        picturesMap.put("sancho@vitalis.com", "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xlf1/v/t1.0-9/14611023_10154547018059144_1423955428690896778_n.jpg?oh=bb89db306ebc7c4adea5dcbe2298a149&oe=586C74AC&__gda__=1487668243_e7c6ae65113c49801bc756274701ffdb");
    }

    public static String getPictureUrl(String mail){
        return picturesMap.get(mail);
    }
}
