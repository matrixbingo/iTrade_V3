package ea.service.utils.var.server.help;

import java.util.HashMap;
import java.util.Iterator;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.reloading.FileChangedReloadingStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * Properties文件加载服务
 * @author Liang.W.William
 */
public abstract class VarPropServer {
	private static Logger log = LoggerFactory.getLogger(VarPropServer.class);
	protected HashMap<String,String> map = null;
	private PropertiesConfiguration config = null;
	
	/**
	 * 加载 prop to map
	 * @param url
	 */
    public void loadProp2Map(String url, boolean isReload){
		try {
			this.map = new HashMap<String,String>();
			this.config = new PropertiesConfiguration(url);
			//自动重新加载  
			if(isReload){
				config.setReloadingStrategy(new FileChangedReloadingStrategy());
			}
			//自动保存  
			config.setAutoSave(true);
			Iterator<String> it = config.getKeys();
			while(it.hasNext()){
				String key = it.next();
				this.map.put(key, config.getString(key));
			}
		} catch (ConfigurationException e) {
			e.printStackTrace();
			log.error("加载文件失败:" + config.getURL());
		}
    }
	/**
	 * 从map取数据，如果没有读文件加载到map
	 */
    public String getStr(String key) {
		String rs = null;
		if(key == null){
			return rs;
		}
		if(this.map.containsKey(key)){
			return (String) this.map.get(key);
		}else{
			rs = this.config.getString(key);
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
		if(key == null){
			return rs;
		}
		try{
			if(this.map.containsKey(key)){
				rs = Integer.valueOf(this.map.get(key));
			}else{
				String str = this.getStr(key);
				if(str != null){
					this.map.put(key, str);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return rs;
	}
    public boolean isTrue(String key){
		boolean is = false;
		if(key == null){
			return is;
		}
		Integer in = this.getInt(key); 
		if(in != null && in == 1){
			is = true;
		}
		return is;
	}
    public Boolean getBoolean(Object key){
		if(this.map == null || key == null){
			return false;
		}
		Object obj = this.map.get(key);
		if(obj == null){
			return false;
		}else if(obj instanceof Boolean){
			return (Boolean)obj;
		}
		return new Boolean(obj.toString().equalsIgnoreCase("true"));
	}
    
    public void addProperty(String key, Object value){
		this.config.addProperty(key, value);
	}
    public void setProperty(String key, Object value){
		this.config.setProperty(key, value);
	}
}
