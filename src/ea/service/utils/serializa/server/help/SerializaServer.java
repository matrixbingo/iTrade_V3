package ea.service.utils.serializa.server.help;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Map;

import com.thoughtworks.xstream.XStream;

import ea.service.utils.base.ApplicationPath;

/**
 * 对象持久化服务
 * @author WL
 * @date 2012-11-12 上午10:31:54
 */
public abstract class SerializaServer {
	protected XStream xstream = null;
	
	@SuppressWarnings("rawtypes")
	public void setMap(String name, Map map){
		PrintWriter pw = null;
		try {
			pw = new PrintWriter(ApplicationPath.vars_url + name);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		if(pw != null){
			this.xstream.toXML(map,pw);
		}
	}
	
	@SuppressWarnings("rawtypes")
	public Map getMap(String name){
		String url = ApplicationPath.vars_url + name;
		return (Map) this.xstream.fromXML(new File(url));
	}
}
