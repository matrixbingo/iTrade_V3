package data.jsoup.test;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.Date;


public class IteyeDownLoad {

    /**
     * @method 测试获取内容程序
     */
    public static void main(String[] args) {

        /**
         * 执行分析程序
         */
        //String url = "http://wiki.sankuai.com/pages/viewpage.action";
        String url = "http://wiki.sankuai.com/rest/api/content/search";
        String HtmlContent = getContentByJsoup(url);
        String divContent = getDivContentByJsoup(HtmlContent);
        getLinksByJsoup(divContent);
    }

    /**
     * 使用jsoup来对文档分析
     */
    public static String getDivContentByJsoup(String content) {
        String divContent = "";
        Document doc = Jsoup.parse(content);
        Elements divs = doc.getElementsByClass("main_left");
        divContent = divs.toString();
        System.out.println("size=" + divs.size() + "div===" + divContent);
        return divContent;
    }

    /**
     * 使用jsoup分析divContent
     * 1.获取链接 2.获取url地址
     */
    public static void getLinksByJsoup(String divContent) {
        String abs = "http://www.iteye.com/";
        Document doc = Jsoup.parse(divContent, abs);

        Elements linkStrs = doc.getElementsByTag("li");
        System.out.println("链接===" + linkStrs.size());
        for (Element linkStr : linkStrs) {
            String url = linkStr.getElementsByTag("a").attr("abs:href");
            String title = linkStr.getElementsByTag("a").text();
            System.out.println("标题:" + title + " url:" + url);
        }
    }

    /**
     * 根据jsoup方法获取htmlContent
     */
    public static String getContentByJsoup(String url) {
        String content = "";
        try {
            System.out.println("time=====start");
            Date startdate = new Date();
           /* Document doc = Jsoup.connect(url)
                    //.header("Content-Type", "application/json;charset=UTF-8")
                    .header("Content-Type","application/json")
                    .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36")

                    .header("Authorization", "Basic bGlhbmcud2FuZy5zaDpNYXRyaXgxMjM0")
                   *//* .data("os_authType", "basic")
                    .data("pageId", "56660947")*//*
                    .data("cql","label in (\"热门\",\"团购\",\"客户\")")
                    .timeout(500000)
                    .get();*/

            String body = Jsoup.connect(url)
                    .header("Content-Type", "application/json;charset=UTF-8")
                    .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36")
                    .header("Authorization", "Basic bGlhbmcud2FuZy5zaDpNYXRyaXgxMjM0")
                    .data("cql", "label in (\"热门\",\"团购\",\"客户\")")
                    .timeout(500000)
                    .ignoreContentType(true).execute().body();

            Date enddate = new Date();
            Long time = enddate.getTime() - startdate.getTime();
            System.out.println("使用Jsoup耗时==" + time);
            System.out.println("time=====end");
            /*content = doc.toString();
            System.out.println(doc.title());*/
        } catch (IOException e) {
            e.printStackTrace();
        }
//		System.out.println(content);
        return content;
    }


}
