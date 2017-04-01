package ea.server;
/**
 * @author WL
 * @date 2012-11-8 上午8:24:57
 */
public interface IServer{
	
	public void setServerName(String serverName);
	public String getServerName();
	
	/**
	 * 启动服务接口
	 */
	public boolean startServer();
	
	/**
	 * 关闭服务接口
	 */
	public void stopServer();
	
	/**
	 * 是否服务在运行中
	 * @return true代表运行中,false代表未启动
	 */
	public boolean isRunning();
	
	/**
	 * 添加参数
	 * @param key   参数标识
	 * @param value 参数值
	 */
	public void addPara(Object key,Object value);
	
	/**
	 * 得到指定标识的参数值
	 * @param key
	 * @return
	 */
	public Object getPara(Object key);
}
