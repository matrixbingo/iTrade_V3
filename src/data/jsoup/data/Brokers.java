package data.jsoup.data;

import ea.service.res.db.dao.DBComm;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Attributes;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;

import java.io.IOException;
import java.util.List;

/**
 * 营业部数据初始化 东财
 * Created by liang.wang.sh on 2017/1/24.
 */

public class Brokers {
    private static String baseUrl = "http://data.eastmoney.com/stock/yybcx.html";
    private static int id = 0;


    public static void main(String[] args) throws Exception {
        Element body = getBody(baseUrl);
    }

    private static Element getBody(String url) throws IOException {
        Document doc = Jsoup.connect(url).timeout(10000).get();
        List<Node> list = doc.body().getElementsByClass("company-container").get(0).childNodes();
        for(Node node:list){
            if(node.childNodes().size() == 2){
                Element span = (Element)node.childNodes().get(1);
                Element a = (Element)span.childNodes().get(0);
                Attributes attributes = a.attributes();
                Brokers.addBrokers(a.text(), attributes.get("href"));
            }else if(node.childNodes().size() == 1){
                Element span = (Element) node.childNodes().get(0);
                Element a = (Element) span.childNodes().get(0);
                Attributes attributes = a.attributes();
                Brokers.addBrokers(a.text(), attributes.get("href"));
            }
        }
        return doc.body();
    }

    private static void addBrokers(String name, String url){
        String sql = getExistSql(name, url);
        boolean bool = DBComm.isExist(sql.toString());
        if (!bool) {
            sql = getInsertSql(name, url);
            DBComm.executeUpdate(sql.toString());
        }
        System.out.println(sql.toString());
    }

    private static String getExistSql(String name, String url) {
        StringBuffer sql = new StringBuffer("select id from s_brokers");
        sql.append(" where name = '" + name + "'");
        sql.append(" and url = '" + url + "'");
        return sql.toString();
    }

    private static String getInsertSql(String name, String url) {
        id++;
        String code = getBrokerCodeByUrl(url);
        System.out.println(name + " : " + getBrokerCodeByUrl(url));
        StringBuffer sql = new StringBuffer("INSERT INTO `s_brokers` (`code`, `name`, `url`) VALUES");
        sql.append("('" + code + "', '" + name + "', '" + url + "')");
        return sql.toString();
    }

    private static String getBrokerCodeByUrl(String url){
        String[] arr = url.split("/");
        arr = arr[arr.length-1].split(".html");
        return arr[0];
    }
}
