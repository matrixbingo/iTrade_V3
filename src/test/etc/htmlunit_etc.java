package test.etc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;

import org.apache.commons.logging.LogFactory;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.parser.Parser;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.JavaScriptPage;
import com.gargoylesoftware.htmlunit.NicelyResynchronizingAjaxController;
import com.gargoylesoftware.htmlunit.ScriptException;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.javascript.JavaScriptErrorListener;

//import css.common.etc;

public class htmlunit_etc {
/*
	public final WebClient WEB = new WebClient(BrowserVersion.FIREFOX_17);
	
	*//**
	 * 页面链接地址
	 * *//*
	public String URL = null;
	
	*//**
	 * HtmlPage对象
	 * *//*
	public HtmlPage HTMLUNIT_PAGE = null;
	
	*//**
	 * HtmlPage对象
	 * *//*
	public JavaScriptPage JS_PAGE = null;

	*//**
	 * Jsoup的Document对象
	 * *//*
	public Document JSOUP_DOC = null;

	*//**
	 * Html的源码
	 * *//*
	public String HTML_TXT = "";

	*//**
	 * JS PAGE的内容
	 * *//*
	public String JS_CONTENT = "";

	*//**
	 * 创建一个htmlunitEnt实体,不初始化DOM
	 * *//*
	public htmlunit_etc(){
	}

	public jsoup_etc getJsoup(){

		return new jsoup_etc(JSOUP_DOC);

	}
	
	*//**
	 * 功能:根据url获取一个页面的,jsoup和htmlunit对象
	 * *//*
	*//*
	public boolean create_proxy(boolean is_open_script) throws Exception{

		boolean rtn = false;

		try {
			
			int port = 0;
			WebClient webClient = new WebClient(BrowserVersion.FIREFOX_17, "http://myproxyserver", port);
			DefaultCredentialsProvider credentialsProvider = (DefaultCredentialsProvider) webClient.getCredentialsProvider();  
			    credentialsProvider.addProxyCredentials("username", "password");
			    
		} catch (Exception e) {
			etc.error("downSrc::" + e.toString());
			throw e;
		}
		return rtn;

	}
	*//*
	
	*//**
	 * 功能:根据url获取一个页面的,jsoup和htmlunit对象
	 * *//*
	public boolean create(boolean is_open_script) throws Exception{

		boolean rtn = false;

		try {

			LogFactory.getFactory().setAttribute("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.NoOpLog");
		    java.util.logging.Logger.getLogger("com.gargoylesoftware.htmlunit").setLevel(Level.OFF); 
		    java.util.logging.Logger.getLogger("org.apache.commons.httpclient").setLevel(Level.OFF);

			//URL = url;
			WEB.getOptions().setThrowExceptionOnFailingStatusCode(false);
			WEB.getOptions().setThrowExceptionOnScriptError(false);		    
			WEB.getOptions().setJavaScriptEnabled(false);
			WEB.getCookieManager().setCookiesEnabled(false);
			WEB.getOptions().setThrowExceptionOnScriptError(false);
			WEB.getOptions().setCssEnabled(false);
			//WEB.getOptions().setTimeout(3 * 1000);

			WEB.getOptions().setThrowExceptionOnFailingStatusCode(false);
			WEB.getOptions().setThrowExceptionOnScriptError(false);		    
			WEB.getOptions().setThrowExceptionOnScriptError(false);

			if (is_open_script){
				WEB.getOptions().setJavaScriptEnabled(true);				
			}
			
			WEB.getCookieManager().setCookiesEnabled(false);
			WEB.getOptions().setRedirectEnabled(true);
			WEB.setAjaxController(new NicelyResynchronizingAjaxController());

			WEB.setJavaScriptErrorListener(new JavaScriptErrorListener() {

				public void loadScriptError(HtmlPage arg0, URL arg1,
						Exception arg2) {
				}

				public void malformedScriptURL(HtmlPage arg0, String arg1,
						MalformedURLException arg2) {
				}

				public void scriptException(HtmlPage arg0, ScriptException arg1) {
				}

				public void timeoutError(HtmlPage arg0, long arg1, long arg2) {
				}

		    });
			
			//获取对象后,关闭窗体
			WEB.closeAllWindows();

			rtn = true;

		} catch (Exception e) {
			etc.error("downSrc::" + e.toString());
			throw e;
		}
		return rtn;

	}

	*//**
	 * 功能:根据url获取一个页面的,jsoup和htmlunit对象
	 * *//*
	public boolean create_fromfile() throws Exception{

		boolean rtn = false;

		try {

			LogFactory.getFactory().setAttribute("org.apache.commons.logging.Log", "org.apache.commons.logging.impl.NoOpLog");
		    java.util.logging.Logger.getLogger("com.gargoylesoftware.htmlunit").setLevel(Level.OFF); 
		    java.util.logging.Logger.getLogger("org.apache.commons.httpclient").setLevel(Level.OFF);

			
			WEB.getOptions().setThrowExceptionOnFailingStatusCode(false);
			WEB.getOptions().setThrowExceptionOnScriptError(false);		    
			
			WEB.getCookieManager().setCookiesEnabled(false);
			WEB.getOptions().setThrowExceptionOnScriptError(false);
			WEB.getOptions().setCssEnabled(false);

			WEB.getOptions().setThrowExceptionOnFailingStatusCode(false);
			WEB.getOptions().setThrowExceptionOnScriptError(false);		    
			WEB.getOptions().setThrowExceptionOnScriptError(false);
			
			WEB.getOptions().setRedirectEnabled(false);
			WEB.getOptions().setActiveXNative(false);
			WEB.getOptions().setGeolocationEnabled(false);
			//WEB.getOptions().setPopupBlockerEnabled(enabled);
			
			WEB.setAjaxController(new NicelyResynchronizingAjaxController());

			WEB.setJavaScriptErrorListener(new JavaScriptErrorListener() {

				public void loadScriptError(HtmlPage arg0, URL arg1,
						Exception arg2) {
				}

				public void malformedScriptURL(HtmlPage arg0, String arg1,
						MalformedURLException arg2) {
				}

				public void scriptException(HtmlPage arg0, ScriptException arg1) {
				}

				public void timeoutError(HtmlPage arg0, long arg1, long arg2) {
				}

		    });

			//HTMLUNIT_PAGE = WEB.getPage(url);
			//获取对象后,关闭窗体
			//WEB.closeAllWindows();

			rtn = true;

		} catch (Exception e) {
			etc.error("downSrc::" + e.toString());
			throw e;
		}
		return rtn;

	}

	*//**
	 * 
	 * 功能:根据url获取一个页面的,jsoup和htmlunit对象
	 * 
	 * 参数:url 网页地址
	 * 		is_open_script 是否执行js
	 * 		js_time js执行的等待时间
	 * 
	 * *//*
	public boolean load(String url, boolean is_open_script, int js_time, boolean is_syn) throws Exception{

		boolean rtn = false;

		try {

			URL = url;
			if (is_open_script){

				WEB.getOptions().setJavaScriptEnabled(true);
				WEB.waitForBackgroundJavaScript(js_time * 1000);
				WEB.waitForBackgroundJavaScriptStartingBefore(js_time * 1000);

			}

			HTMLUNIT_PAGE = WEB.getPage(url);

			if (is_syn){

				synchronized (HTMLUNIT_PAGE){
					HTMLUNIT_PAGE.wait(1000);
				}

				for (int i = 0; i < 1; i++) {

					//String img_src = HTMLUNIT_PAGE.getByXPath("//div[@class='pic-panel']/a/img").get(0).toString();
					//etc.debug("img ---->" + img_src);

					//if (!HTMLUNIT_PAGE.getByXPath("//div[@class='pic-panel']/a/img").isEmpty()) {				
					//	break;
					//}

					synchronized (HTMLUNIT_PAGE) {
						HTMLUNIT_PAGE.wait(2000);
					}

				}
				
			}

			HTML_TXT = HTMLUNIT_PAGE.asXml();
			JSOUP_DOC = Jsoup.parse(HTML_TXT, "", Parser.xmlParser());

			rtn = true;

		} catch (Exception e) {
			etc.error("downSrc::" + e.toString());
			throw e;
		}
		return rtn;

	}
	
	*//**
	 * 功能:根据url获取一个页面的,jsoup和htmlunit对象
	 * *//*
	public boolean load_jspage(String url, boolean is_open_script) throws Exception{

		boolean rtn = false;

		try {

			URL = url;
			JS_PAGE = WEB.getPage(url);
			if (is_open_script){
				WEB.waitForBackgroundJavaScript(3 * 1000);	
			}
			
			JS_CONTENT = JS_PAGE.getContent();
			rtn = true;

		} catch (Exception e) {
			etc.error("downSrc::" + e.toString());
			throw e;
		}
		return rtn;

	}	
	*//**
	 * 功能:根据url获取一个页面的,jsoup和htmlunit对象
	 * *//*
	public boolean loadfile(String url) throws Exception{

		boolean rtn = false;

		try {

			URL = url;
			HTMLUNIT_PAGE = WEB.getPage(url);

			//获取对象后,关闭窗体
			//WEB.closeAllWindows();
			rtn = true;

		} catch (Exception e) {
			etc.error("downSrc::" + e.toString());
			throw e;
		}
		return rtn;

	}
	
	*//**
	 * 功能:用新的doc对象替换JSOUP_DOC,利用该方法可在JSOUP_DOC对象中追加内容
	 * @param doc 修饰之后的doc对象
	 * *//*
	public void decorateDoc(Document doc){
		
		this.JSOUP_DOC = doc;

	}
	
	*//**
	 * 功能:输出文件,需要首先初始化'JSOUP_DOC'对象
	 * @param path 保存文件的路径
	 * *//*
	public void dumpPage(String path){

		FileOutputStream fos;
		try {

			File f = new File(path);
			if (f.exists()){
				f.delete();
			}
			//etc.FILES.checkFile(path);

			fos = new FileOutputStream(path, true);			
			OutputStreamWriter out = new OutputStreamWriter(
					fos, "UTF-8");

			//将输出的文件内容中的编码格式置换
			String v = JSOUP_DOC.html().replace("charset=gb2312", "charset=utf-8");			
			out.write(v);

			out.flush();
			fos.close();
            out.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

	}*/

}
