package ea.service.utils.var.server.help;

import java.util.HashMap;
import java.util.List;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.configuration.tree.ConfigurationNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * XML文件加载服务
 * @author Liang.W.William
 */
public abstract class VarXmlServer{
	private static Logger log = LoggerFactory.getLogger(VarXmlServer.class);
	protected HashMap<String,String> map = null;
	private HashMap<String,Integer> ts = null;
	private String name = "[@name]", key = "[@key]", value = "[@value]";
	private String url = null;
	
	/**
	 *  初始化XML to Map
	 * @param url
	 */
    public void loadXML2Map(String url){
    	this.map = new HashMap<String,String>();
    	this.ts = new HashMap<String,Integer>();
    	this.url = url;
    	XMLConfiguration config = null;
		try {
			config = new XMLConfiguration(url);
		} catch (ConfigurationException e) {
			e.printStackTrace();
		}
    	int count = config.getRoot().getChildrenCount();
    	List<ConfigurationNode> chlilds = config.getRoot().getChildren();
    	
        for(int i = 0;i < count; i++){
        	ConfigurationNode son = (ConfigurationNode) chlilds.get(i);
        	String group = son.getName();
        	this.put(group);
        	this.initGroup(config, chlilds.get(i), group + "("+ this.ts.get(group) +")");
        }
    }  
    private void put(String key){
    	if(key == null){
			return;
		}
    	Integer rs = this.ts.get(key);
    	if(rs == null){
    		this.ts.put(key,0);
    	}else{
    		this.ts.put(key,rs+1);
    	}
    }
	/**
	 * 递归根子节点
	 */
    protected void initGroup(XMLConfiguration config, ConfigurationNode chlild, String group){
    	List<ConfigurationNode> chlilds = chlild.getChildren();
    	int count = chlilds.size();
    	if(count == 0){
    		return;
    	}
    	for(int i = 0 ;i< count;i++){
    		ConfigurationNode son = (ConfigurationNode) chlilds.get(i);
    		List<ConfigurationNode> sub = son.getChildren();
    		String pare = null;
    		if(sub.size() == 0){
    			String var = son.getName();
    			pare = group + "." + var + "("+ i +")";
    			String name = config.getString(pare + this.name);
    			String key = config.getString(pare + this.key);
    			if(name != null){
    				this.addPara(name, config.getString(pare + this.value));
    			}else if(key != null){
    				this.addPara(key, config.getString(pare + this.value));
    			}
    		}else{
    			String var = son.getName();
    			pare = group + "." + var + "("+ i +")";
    			String name = config.getString(pare + this.name);
    			String key = config.getString(pare + this.key);
    			if(name != null){
    				this.addPara(name, config.getString(pare + this.value));
    			}else if(key != null){
    				this.addPara(key, config.getString(pare + this.value));
    			}
    			this.initGroup(config, (ConfigurationNode) son, pare);
    		}
    	}
    }

    protected void addPara(String key, String value){
    	if(key == null || value == null){
			return ;
		}
    	try{
	    	if(this.map.containsKey(key)){
	    		return;
	    	}else{
	    		this.map.put(key, value);
	    	}
    	}catch(Exception e){
			e.printStackTrace();
		}
    }
    protected String getPara(String key){
    	if(key == null){
			return null;
		}
    	try{
	    	if(this.map.containsKey(key)){
	    		return this.map.get(key);
	    	}else{
	    		log.error("发生异常，当前文件:" + this.url + "未找到key:" + key);
	    	}
    	}catch(Exception e){
			e.printStackTrace();
		}
    	return null;
    }
}
