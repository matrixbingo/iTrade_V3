package ea.service.utils.serializa.server.manager;

import com.thoughtworks.xstream.XStream;

import ea.service.utils.serializa.server.help.SerializaServer;

public class SerializaManager extends SerializaServer {
	
	private static SerializaManager singleInstance = null;
	
	public static SerializaManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (SerializaManager.class) {
				if (singleInstance == null) {
					singleInstance = new SerializaManager();
				}
			}
		}
		return singleInstance;
	}
	private SerializaManager(){
		this.xstream = new XStream();
	}
	public static void main(String[] args) {

	}
}
