package quartz;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import ea.service.utils.base.ApplicationPath;

public class ServerContral {
	
	@SuppressWarnings("unused")
	public static void serverStart(){
		String url = ApplicationPath.base_url + "/WEB-INF/spring/applicationContext.xml";
		ApplicationContext ac = new FileSystemXmlApplicationContext(url);
	}
	
	public static void main(String[] args) {
		ServerContral.serverStart();
	}
}
