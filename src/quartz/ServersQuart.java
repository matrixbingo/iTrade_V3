package quartz;

import ea.server.Common;
import ea.server.Controller;
import ea.service.res.period.RefreshCandles;
import ea.service.utils.comm.Util;


/**
 * 定时服务总控制
 * @date 2012-10-8 上午10:47:52
 */
public class ServersQuart {
	private Common comm = null;

	private Common getComm(){
		if(null == this.comm){
			this.comm = new Common();
			return this.comm;
		}
		return this.comm;
	}
	/**
	 * 刷新全部k线数据
	 */
	public void creatPeriods(){
		Controller.log.info(Util.getCurTime() + ": 刷新全部k线数据  >>>>");
		RefreshCandles.getSingleInstance().creatPeriods();
	}
	/**
	 * 更新M1数据 
	 */
	public void creatM1KLine(){
		Controller.log.info(Util.getCurTime() + ": 更新M1数据  >>");
		RefreshCandles.getSingleInstance().creatM1KLine();
	}
	
	/**
	 * 执行
	 */
	public void runCommonThreads(){
	/*	TPHandler tp = TPHandler.getInstance();
		tp.addTask(new ThreadPoolTask("第1个线程"));
		tp.addTask(new ThreadPoolTask("第2个线程"));*/

		Controller.log.info(Util.getCurTime() + ": 执行EA  >>");
		this.getComm().run();
	}
	
	public static void main(String[] args) {
		
	}
}
