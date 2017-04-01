package ea.service.utils.base;

import org.apache.commons.dbcp.BasicDataSource;

import ea.server.Controller;


/**
 * 项目路径信息工具类
 * @author Liang.W.William
 */
public class ApplicationPath {
	
	public final static String base_url = ApplicationPath.getRootPath();
	public final static String conf_url = new StringBuffer(ApplicationPath.base_url).append("/WEB-INF/conf/").toString();
	public final static String vars_url = new StringBuffer(ApplicationPath.base_url).append("/WEB-INF/vars/").toString();
	
	/**
	 * 获取项目根目录通用
	 */
	public static String getRootPath() {
		if(Controller.isAbsPath){
			return Controller.absPath;
		}else{
			return ApplicationPath.getPath();
		}
	}
	
	private static String getPath(){
		//因为类名为"Application"，因此" Application.class"一定能找到
		String result = ApplicationPath.class.getResource("ApplicationPath.class").toString();
		int index = result.indexOf("WEB-INF");
		if (index == -1) {
			index = result.indexOf("bin");
		}
		result = result.substring(0, index);
		if (result.startsWith("jar")) {
			// 当class文件在jar文件中时，返回"jar:file:/F:/ ..."样的路径
			result = result.substring(10);
		} else if (result.startsWith("file")) {
			// 当class文件在class文件中时，返回"file:/F:/ ..."样的路径
			result = result.substring(6);
		}
		if (result.endsWith("/"))
			result = result.substring(0, result.length() - 1);// 不包含最后的"/"
		return result;
	}
	
	public static int getDataBaseYear(){
		try{
			BasicDataSource bean = (BasicDataSource)Controller.ct.getBean("dataSource");
			String url = bean.getUrl();
			int bin = url.indexOf(Controller.data_key) + 2;
			return Integer.valueOf(url.substring(bin, bin + 4));
		}catch(Exception e){
			System.out.println(e);
		}
		return 0;
	}
	
	public static void main(String[] args) {
		System.out.println(new StringBuffer("1111").append("2222").toString());
		System.out.println(ApplicationPath.base_url);
		System.out.println(ApplicationPath.getRootPath());
	}
}
