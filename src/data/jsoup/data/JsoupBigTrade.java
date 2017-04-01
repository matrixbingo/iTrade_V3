package data.jsoup.data;

import data.jsoup.dto.BigTradeDto;
import data.jsoup.dto.UrlDto;
import data.jsoup.enums.VolumeTypeEnum;
import ea.service.res.db.dao.DBComm;
import ea.service.utils.comm.SimpleDateUtil;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import test.ArrayList;
import test.utils.MathUtil;

import java.io.IOException;
import java.util.List;

/**
 * 一点仓位数据
 * Created by liang.wang.sh on 2017/1/24.
 */

public class JsoupBigTrade {
    private static String TIME_FORMAT = "yyyy-MM-dd";
    private static String totalClass = "total";
    private static String timeEnd = "2017-3-27";
    private static String baseUrl = "http://www.yidiancangwei.com/ShareTracking.php";
    private static long maxId;

    public static void main(String[] args) throws Exception {

        List<UrlDto> urls = getUrls(timeEnd);
        maxId = DBComm.getNum("select max(id) maxId from s_big_trade", "maxId");
        for(UrlDto dto : urls){
            System.out.println(dto.getUrl());
            addBigTradeDtos(dto);
        }
    }

    private static void addBigTrade(BigTradeDto dto){
        StringBuffer sql = new StringBuffer();
        sql.append("select id from s_big_trade where type = ");
        sql.append(dto.getType());
        sql.append(" and code = '");
        sql.append(dto.getCode());
        sql.append("' and time = ");
        sql.append(dto.getTime());
        boolean bool = DBComm.isExist(sql.toString());
        if(!bool){
            maxId++;
            sql = new StringBuffer();
            sql.append("INSERT INTO `s_big_trade` (`id`, `type`, `time`, `code`, `name`, `price`, `range`, `speed`, `stock`, `buy`, `sel`) VALUES");
            sql.append("(" + maxId + ",");
            sql.append(dto.getType() + ",");
            sql.append(dto.getTime() + " , ");
            sql.append("'" + dto.getCode() + "' , ");
            sql.append("'" + dto.getName() + "' , ");
            sql.append(dto.getPrice() + " , ");
            sql.append(dto.getRange() + " , ");
            sql.append(dto.getSpeed() + " , ");
            sql.append(dto.getStock() + " , ");
            sql.append(dto.getBuy() + " , ");
            sql.append(dto.getSel() + ")");
            System.out.println(sql.toString());
            DBComm.executeUpdate(sql.toString());
        }
    }

    private static List<UrlDto> getUrls(String time) throws Exception{
        List<UrlDto> list = new ArrayList<UrlDto>();
        for (VolumeTypeEnum v : VolumeTypeEnum.values()) {

            String url = baseUrl + "?Time=" + timeEnd + "&Type=" + v.getCode();
            Element body = getBody(url);
            int total = getTotal(body, totalClass);
            if (total <= 1) {
                UrlDto dto = new UrlDto();
                dto.setType(v.getCode());
                dto.setTime(SimpleDateUtil.str2Int(TIME_FORMAT, time));
                //System.out.println(url);
                dto.setUrl(url);
                list.add(dto);
            } else if (total > 1) {
                for (int i = 1; i <= total; i++) {
                    UrlDto dto = new UrlDto();
                    dto.setType(v.getCode());
                    dto.setTime(SimpleDateUtil.str2Int(TIME_FORMAT, time));
                    dto.setUrl(url + "&Page=" + i);
                    list.add(dto);
                    //list.add(url + "&Page=" + i);
                    //System.out.println(url + "&Page=" + i);
                }
            }
            //list.add(dto);
            //System.out.println(total);
        }

        return list;
    }

    private static void addBigTradeDtos(UrlDto dto) throws IOException {
        Document doc = Jsoup.connect(dto.getUrl()).get();
        Element body = doc.body();
        Elements tbodys = body.getElementsByClass("Tbody");
        Elements trs;
        if (tbodys.size() == 1) {
            trs = tbodys.get(0).getElementsByTag("tr");
            for (Element tr : trs) {
                Elements tds = tr.getElementsByTag("td");
                BigTradeDto b = new BigTradeDto();
                if (tds.size() == 9) {
                    b.setType(dto.getType());
                    b.setTime(dto.getTime());
                    b.setCode(tds.get(1).text());
                    b.setName(getName(tds.get(2).text()));
                    b.setPrice(Double.parseDouble(tds.get(3).text()));
                    b.setRange(MathUtil.getDoubleValue(tds.get(4).text()));
                    b.setSpeed(Double.parseDouble(tds.get(5).text()));
                    b.setStock(getStock(tds.get(6).text()));
                    b.setBuy(MathUtil.getIntValue(tds.get(7).text()));
                    b.setSel(MathUtil.getIntValue(tds.get(8).text()));
                    addBigTrade(b);
                }

                for (Element td : tds) {
                    System.out.print(td.text() + "; ");
                }
                System.out.println("\n");
            }
        }
    }

    private static String getName(String name){
        if(name.contains("*")){
            name = name.replace("*", "");
        }
        return name;
    }

    private static Element getBody(String url) throws IOException {
        Document doc = Jsoup.connect(url).get();
        return doc.body();
    }

    private static int getTotal(Element body, String totalClass) {
        int totals = 0;
        Elements total = body.getElementsByClass(totalClass);
        if (total.size() == 1 && total.hasText()) {
            String text = total.text();
            if (text.startsWith("共") && text.endsWith("页")) {
                text = text.replace("共", "");
                text = text.replace("页", "");
                text = text.trim();
                totals = Integer.parseInt(text);
            }
        }
        return totals;
    }

    private static Double getStock(String str) {
        if (str.contains("亿")) {
            return MathUtil.getDoubleValue(str);
        }
        if (str.contains("万")) {
            double currency = MathUtil.getDoubleValue(str) / 10000;
            return currency;
        }
        return 0D;
    }

}
