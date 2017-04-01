package web.dao;

/**
 * Created by liang.wang.sh on 2017/2/6.
 */
public class ServiceResult {

    public static final Integer INTERNAL_ERROR = 500;
    public static final Integer SUCCESS = 200;
    private Integer code = SUCCESS;
    private Object msg;

    public static ServiceResult fail(Object msg) {

        ServiceResult serviceResult = new ServiceResult();
        serviceResult.setCode(INTERNAL_ERROR);
        serviceResult.setMsg(msg);
        return serviceResult;
    }

    public static ServiceResult success() {
        return new ServiceResult();
    }

    public static ServiceResult success(String msg) {
        ServiceResult serviceResult = new ServiceResult();
        serviceResult.setMsg(msg);
        serviceResult.setCode(SUCCESS);
        return serviceResult;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public Object getMsg() {
        return msg;
    }

    public void setMsg(Object msg) {
        this.msg = msg;
    }
}
