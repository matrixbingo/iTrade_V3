package web.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang.StringUtils;

public class BaseController {
    private Gson gson;

    public String result(String callback, String jsonStr) {
        if (StringUtils.isBlank(callback)) {
            return jsonStr;
        } else {
            return callback + "(" + jsonStr + ");";
        }
    }

    public String obj2Json(Object obj) {
        String rs = "";
        if (null == this.gson) {
            this.gson = new GsonBuilder().disableHtmlEscaping().create();
        }
        rs = this.gson.toJson(obj);
        return rs;
    }
}
