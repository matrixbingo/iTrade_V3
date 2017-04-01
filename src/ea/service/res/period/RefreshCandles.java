package ea.service.res.period;

import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ea.service.res.db.dao.MySql_DB;
import ea.service.utils.comm.Util;
import ea.service.utils.mem.CommMetaTrader;

/**
 * 更新并计算周期K线数据
 * @author Liang.W.William
 *
 */
public class RefreshCandles {
	private static Logger logger = LoggerFactory.getLogger(RefreshCandles.class);
	private static RefreshCandles singleInstance = null; //唯一实例 
	private MySql_DB db = MySql_DB.getSingleInstance();

	/**
	 * 返回唯一实例。如果是第一次调用此方法，则创建实例
	 */
	public static RefreshCandles getSingleInstance(){
		if (singleInstance == null) {
			synchronized (RefreshCandles.class) {
				if (singleInstance == null) {
					singleInstance = new RefreshCandles();
				}
			}
		}
		return singleInstance;
	}
	/**
	 * 根据数据库表M1的数据计算并刷新M5,M10,M30,H1的k线数据：定时更新
	 * @throws SQLException
	 */
	public void creatPeriods(){
		System.out.println(Util.getCurTime() + ": Start Create Candlestick Charts----->");
		logger.debug("Start Create Candlestick Charts----->");
		//step01:计算M5
		CreatPeriodM5 creatM5 = CreatPeriodM5.getSingleInstance();
		creatM5.creatPeriods(db);

		//Step02:计算M10
		CreatPeriodM10 creatM10 = CreatPeriodM10.getSingleInstance();
		creatM10.creatPeriods(db);
//		
//		//Step03:计算M30
		CreatPeriodM30 creatM30 = CreatPeriodM30.getSingleInstance();
		creatM30.creatPeriods(db);

//		//Step04:计算M60
		CreatPeriodM60 creatM60 = CreatPeriodM60.getSingleInstance();
		creatM60.creatPeriods(db);
		
//		//Step04:计算M60
		CreatPeriodM240 creatM240 = CreatPeriodM240.getSingleInstance();
		creatM240.creatPeriods(db);
	
		logger.debug("End Create Candlestick Charts----->");
	}
	/**
	 * 从内存中更新M1数据：定时更新
	 */
	public void creatM1KLine(){
		String rs = CommMetaTrader.getSingleInstance().readMemory();
		System.out.println("-------->" + rs);
		CreatPeriodM1.getSingleInstance().creatPeriods(db,rs);
		logger.info("更新M1数据完成");
	}
	
	public static void main(String[] args) throws SQLException {
		//刷新K线
		RefreshCandles c = RefreshCandles.getSingleInstance();
		c.creatPeriods();
		
		//测试数据同步
//		String rs = CommMetaTrader.getSingleInstance().readMemory();
//		System.out.println("更新M1数据-----> " + rs);

	}
}
