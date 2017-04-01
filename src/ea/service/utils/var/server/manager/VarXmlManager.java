package ea.service.utils.var.server.manager;

import java.util.HashMap;

import ea.service.utils.var.server.help.VarXmlServer;

public class VarXmlManager extends VarXmlServer {
	private static VarXmlManager singleInstance = null;
	private static HashMap<String,VarXmlManager> instances = null;
	public static VarXmlManager getSingleInstance(String url){
		if(instances == null){
			instances = new HashMap<String,VarXmlManager>();
		}
		singleInstance = instances.get(url);
		if(singleInstance != null && singleInstance instanceof VarXmlManager){
			return singleInstance;
		}else{
			singleInstance = new VarXmlManager(url);
			instances.put(url, singleInstance);
		}
		return singleInstance;
	}
	
	private VarXmlManager(String url) {
		super.loadXML2Map(url);
	}
	
	public String getStr(String key) {
		return super.getPara(key);
	}
	
	public Integer getInt(String key) {
		try{
			String str = this.getPara(key);
			if(str != null){
				return Integer.valueOf(str);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	public Double getDouble(String key) {
		try{
			String str = this.getPara(key);
			if(str != null){
				return Double.valueOf(str);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	public boolean isTrue(String key){
		boolean is = false;
		Integer in = this.getInt(key); 
		if(in != null && in == 1){
			is = true;
		}
		return is;
	}
}
