package ea.service.utils.var.server.manager;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import ea.service.utils.var.server.help.VarPropServer;

public class VarPropManager extends VarPropServer {
	private static VarPropManager singleInstance = null;
	private static HashMap<String,VarPropManager> instances = null;
	/**
	 * @param url:文件路径
	 * @param isReload：是否自动刷新
	 * @return
	 */
	public static VarPropManager getSingleInstance(String url, boolean isReload){
		if(instances == null){
			instances = new HashMap<String,VarPropManager>();
		}
		String key = url + isReload;
		singleInstance = instances.get(key);
		if(singleInstance != null && singleInstance instanceof VarPropManager){
			return singleInstance;
		}else{
			singleInstance = new VarPropManager(url,isReload);
			instances.put(key, singleInstance);
		}
		return singleInstance;
	}
	
	private VarPropManager(String url, boolean isReload) {
		super.loadProp2Map(url,isReload);
	}
	/**
	 * map数据根据键值对添加或修改到配置文件
	 * @param map
	 */
	public void map2Prop(HashMap<String,Object> map){
		Iterator<Entry<String, Object>> iter = map.entrySet().iterator(); 
		while (iter.hasNext()) { 
		    Map.Entry<String, Object> entry = (Map.Entry<String, Object>) iter.next();
		    String key = entry.getKey();
		    Object val = entry.getValue();
		    super.setProperty(key, val);
		}
	}
}
