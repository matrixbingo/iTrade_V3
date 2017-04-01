package ea.server;

//import ea.service.res.data.condition.ConditionDataManager;
//import ea.tactics.eolisten.manager.MoveOutMarketManager;

public class ServerListener {

	/**
	 * 启动服务时监听
	 */
	public static void startServerListener(){
		
	}
	
	/**
	 * 运行结束监听
	 */
	public static void endServerListener(){
	
	}
	
	/**
	 * 暂停服务监听
	 */
	public static void pauseServerListener(){
		//MoveOutMarketManager.getSingleInstance().saveData();
		//ConditionDataManager.getSingleInstance().saveConditionData();
	}
	
	/**
	 * 继续运行服务监听
	 */
	public static void runServerListener(){
		//MoveOutMarketManager.getSingleInstance().initData();
		//ConditionDataManager.getSingleInstance().initConditionData();
		
	}
}
