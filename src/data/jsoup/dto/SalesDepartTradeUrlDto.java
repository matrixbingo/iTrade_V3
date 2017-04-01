package data.jsoup.dto;

/**
 * "http://data.eastmoney.com/DataCenter_V3/stock2016/jymx.ashx?pagesize=50&page=2&js=var%20nbxdMMSB&param=&sortRule=-1&sortType=&gpfw=0&code=80104016&rt=24846134";
 * 
 * 营业部 Url
 * Created by liang.wang.sh on 2017/3/28.
 */
public class SalesDepartTradeUrlDto {
    private int page = 1;
    private int pagesize = 500;
    private String code;

    public String getUrl(){
        StringBuffer url = new StringBuffer("http://data.eastmoney.com/DataCenter_V3/stock2016/jymx.ashx?pagesize=");
        url.append(this.pagesize);
        url.append("&page=");
        url.append(this.page);
        url.append("&js=var%20nbxdMMSB&param=&sortRule=-1&sortType=&gpfw=0&code=");
        url.append(this.code);
        url.append("&rt=24846134");
        return url.toString();
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPagesize() {
        return pagesize;
    }

    public void setPagesize(int pagesize) {
        this.pagesize = pagesize;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
