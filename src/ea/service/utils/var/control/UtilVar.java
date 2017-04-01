package ea.service.utils.var.control;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Properties;

/**
 * 读写属性文件的工具类
 */
public class UtilVar {
	//private static Logger log = LoggerFactory.getLogger(UtilVar.class);
	private static UtilVar singleInstance = null; // 唯一实例
	private String url = "control.properties";
	private HashMap<String,Object> map = null;
	
	public static UtilVar getSingleInstance() {
		if (singleInstance == null) {
			synchronized (UtilVar.class) {
				if (singleInstance == null) {
					singleInstance = new UtilVar();
				}
			}
		}
		return singleInstance;
	}

	private UtilVar() {
		map = new HashMap<String,Object>();
	}
	public void init(String url){

		System.out.println("");
	}
	/**
	 * 读文件
	 * @param key
	 * @return
	 */
	private String getProperty(String key){
		String rs = null;
		
		InputStream in = UtilVar.class.getClassLoader().getResourceAsStream(this.url);
		Properties prop = new Properties();
		try {
			prop.load(in);
			rs = prop.getProperty(key);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return rs;
	}
	
	/**
	 * 从map取数据，如果没有读文件加载到map
	 */
	public String getStr(String key) {
		String rs = null;
		if(this.map.containsKey(key)){
			rs = (String) this.map.get(key);
		}else{
			rs = this.getProperty(key);
			if(rs != null){
				this.map.put(key, rs);
			}
		}
		return rs;
	}
	/**
	 * 从map取数据，如果没有读文件加载到map
	 */
	public Integer getInt(String key) {
		Integer rs = null;
		try{
			if(this.map.containsKey(key)){
				rs = (Integer) this.map.get(key);
			}else{
				String str = this.getProperty(key);
				if(str != null){
					rs = Integer.valueOf(str);
				}
				if(rs != null){
					this.map.put(key, rs);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return rs;
	}
	
	public boolean isTrue(String key){
		boolean is = false;
		Integer in = this.getInt(key); 
		if(in != null && in == 1){
			is = true;
		}
		return is;
	}
	
	public static void main(String args[]) {
		UtilVar pl = UtilVar.getSingleInstance();
		//String Encode = pl.getStr("shareMem01");
		pl.init("WebContent/WEB-INF/conf/var.properties");
		//System.out.println(pl.isTrue("isTest"));
	}
}
