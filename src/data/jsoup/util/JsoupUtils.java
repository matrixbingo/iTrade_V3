package data.jsoup.util;

import org.apache.commons.collections.CollectionUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;

import java.io.IOException;
import java.util.List;
import java.util.Random;

/**
 * Created by liang.wang.sh on 2017/3/29.
 */
public class JsoupUtils {

   private static Random random = new Random();

   public static int getRandom(int min, int max){
        return random.nextInt(max) % (max - min + 1) + min;
    }

    /**
     * 根据Url获取jSON
     * 例如"http://data.eastmoney.com/DataCenter_V3/stock2016/jymx.ashx?pagesize=50&page=1&js=var%20nbxdMMSB&param=&sortRule=-1&sortType=&gpfw=0&code=80103344&rt=24846134"
     * @param url
     * @return
     * @throws IOException
     */
    public static String getJson(String url) {
        Document doc = null;
        String json = "";
        try {
            doc = Jsoup.connect(url).timeout(100000).get();
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
        }
        JsoupUtils.sleep(getRandom(500, 1500));
        if (doc != null) {
            List<Node> nodes = doc.childNodes();
            if (!CollectionUtils.isEmpty(nodes)) {
                List<Node> list = nodes.get(0).childNodes();
                if (!CollectionUtils.isEmpty(list)) {
                    TextNode t = (TextNode) list.get(1).childNodes().get(0);
                    String[] arr = t.text().split("=");
                    for (int i = 1; i < arr.length; i++) {
                        json += arr[i];
                    }
                }
            }
        }
        return json;
    }

    public static void sleep(long time){
        try {
            Thread.sleep(time);
        } catch (Exception e) {
            e.getStackTrace();
        }
    }
}
