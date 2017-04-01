package data.jsoup.dto;

/**
 * "http://data.eastmoney.com/DataCenter_V3/stock2016/yybSearch.ashx?pagesize=500&page=1&js=var%20qpVPspYo&param=&sortRule=-1&sortType=UpCount&typeCode=1&gpfw=0&code=80084302&rt=24844492";
 *
 * 营业部 Url
 * Created by liang.wang.sh on 2017/3/28.
 */
public class SalesDepartUrlDto {
    private int page = 1;
    private int pagesize = 50;
    private String code;

    public String getUrl(){
        StringBuffer url = new StringBuffer("http://data.eastmoney.com/DataCenter_V3/stock2016/yybSearch.ashx?pagesize=");
        url.append(this.pagesize);
        url.append("&page=");
        url.append(this.page);
        url.append("&js=var%20qpVPspYo&param=&sortRule=-1&sortType=UpCount&typeCode=1&gpfw=0&code=");
        url.append(this.code);
        url.append("&rt=24844492");
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
