package data.jsoup.dto;

/**
 * Created by liang.wang.sh on 2017/1/25.
 */
public class UrlDto {
    private int time;
    private int type;
    private String url;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }
}
