package ea.service.utils.overPara.help;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
/**
 * 全局变量服务
 * @author Liang.W.William
 */
public abstract class OverallPareServer {
	protected HashMap<Object,Object> paraMapping = null;
   
	@SuppressWarnings("unchecked")
	protected void addPara(Object key, Object value){
		if(key == null || value == null){
			return ;
		}
		if(this.paraMapping == null){
			this.paraMapping = new HashMap<Object,Object>();
		}
		Object existValue = this.paraMapping.get(key);
		if(existValue == null){
			this.paraMapping.put(key, value);
		}else if(existValue instanceof List){
			((LinkedList<Object>)existValue).add(value);
		}else{
			LinkedList<Object> tempList = new LinkedList<Object>();
			tempList.add(existValue);
			tempList.add(value);
			this.paraMapping.put(key, tempList);
		}
	}
	protected void setPara(Object key, Object value){
		if(key == null || value == null){
			return ;
		}
		if(this.paraMapping == null){
			this.paraMapping = new HashMap<Object,Object>();
		}
		this.paraMapping.put(key, value);
	}
    protected Object getObject(Object key){
		if(this.paraMapping == null){
			return null;
		}
		return this.paraMapping.get(key);
	}
	
    protected Boolean getBoolean(Object key){
		if(this.paraMapping == null){
			return false;
		}
		Object obj = this.paraMapping.get(key);
		if(obj == null){
			return false;
		}else if(obj instanceof Boolean){
			return (Boolean)obj;
		}
		return new Boolean(obj.toString().equalsIgnoreCase("true"));
	}
	
    protected String getString(Object key){
		if(this.paraMapping == null){
			return null;
		}
		Object obj = this.paraMapping.get(key);
		
		return obj==null?null:obj.toString();
	}
	
    protected Integer getInteger(Object key){
		if(this.paraMapping == null){
			return null;
		}
		Object obj = this.paraMapping.get(key);
		
		if (obj == null){
			return null;
		} else if (obj instanceof Integer){
			return (Integer) obj;
		} else{
			try{
				String str = obj.toString().trim();
				if(str.length() == 0){
					return null;
				}
				if(str.startsWith("0x")){
					return new Integer(Integer.parseInt(str.substring(2),16));
				}else{
					return new Integer(str);
				}
			} catch (Exception e){
				e.printStackTrace();
				return null;
			}
		}
	}
    
    public void remove(Object key){
    	if(key == null || this.paraMapping == null){
			return ;
		}
    	if(this.paraMapping.containsKey(key)){
    		this.paraMapping.remove(key);
    	}
    }
}