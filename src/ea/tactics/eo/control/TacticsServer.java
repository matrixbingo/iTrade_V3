package ea.tactics.eo.control;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import ea.server.Controller;
import ea.service.utils.base.ClassScaner;
import ea.tactics.eo.group.help.TecticsExeServer;

public abstract class TacticsServer {
	
	/**
	 * 加载类指定包的所有类名到list
	 */
	@SuppressWarnings("rawtypes")
	protected HashMap<Integer, TecticsExeServer> loadMap(){
		HashMap<Integer, TecticsExeServer> map = new HashMap<Integer, TecticsExeServer>();
		try {
			Set<Class> checkClasses = new ClassScaner().doScan(Controller.tactics_package);
			TecticsExeServer c = null;
			Iterator<Class> it = null;
	    	if (null != checkClasses && checkClasses.size() > 0) {
	    		it = checkClasses.iterator();
	    		Integer i = null;
	    		while(it.hasNext()){
	    			try {
						c = (TecticsExeServer) Class.forName(it.next().getName()).newInstance();
						i = c.getVersion();
					} catch (InstantiationException e) {
						e.printStackTrace();
					} catch (IllegalAccessException e) {
						e.printStackTrace();
					}
					map.put(i, c);
	    		}
			}
	    	it = null;
	    	c = null;
	    	checkClasses = null;
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return map;
	}
}
