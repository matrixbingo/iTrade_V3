package data.jsoup.dto;

/**
 * 券商
 * Created by liang.wang.sh on 2017/3/27.
 */
public class BrokersDto {
    private int id;
    private int code;
    private String name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
