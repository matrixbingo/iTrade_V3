package quartz;

import ea.server.Controller;
import ea.server.InitData;
import ea.service.res.period.RefreshCandles;
import ea.service.utils.comm.Util;


/**
 * 启动线程池服务
 * @author WL
 * @date 2012-10-16 下午3:52:43
 */
public class CacheLoder {
	
	public void init(){
		RefreshCandles.getSingleInstance().creatPeriods();
		Controller.log.info(Util.getCurTime() + "初始化: 刷新全部k线数据  >>>>");
		
		new InitData().initData();
		Controller.log.info(Util.getCurTime() + "初始化: 加载内存数据变量 >>>>");
/*		TPHandler.getInstance().start();
		System.out.println("启动线程池服务----->");*/
	}
}