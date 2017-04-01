package ea.service.res.period;

import java.sql.SQLException;

import ea.server.Data;
import ea.service.res.db.control.DBHandler;
import ea.service.res.db.dao.MySql_DB;

/**
 * 从内存更新M1数据
 * @author Liang.W.William
 *
 */
public class CreatPeriodM1 {
	
	private static CreatPeriodM1 singleInstance = null; //唯一实例 
	private String tab = "t_candle";

	/**
	 * 返回唯一实例。如果是第一次调用此方法，则创建实例
	 */
	public static CreatPeriodM1 getSingleInstance(){
		if (singleInstance == null) {
			synchronized (CreatPeriodM1.class) {
				if (singleInstance == null) {
					singleInstance = new CreatPeriodM1();
				}
			}
		}
		return singleInstance;
	}
	/**
	 * 根据M1刷新M5
	 * @param db
	 * @throws SQLException
	 */
	public void creatPeriods(MySql_DB db, String str){
		if(str!=null && str.length()>10){
			String[] strs = str.split("_");
			String[] k0 = strs[0].split("\\|");
			String[] k1 = strs[1].split("\\|");
			String time = k1[0].replaceAll("\\.", "").replaceAll("\\:", "").replaceAll(" ", "");
			this.insertPeriodM1(db, time, k1[1], k1[2], k1[3], k1[4]);
			time = k0[0].replaceAll("\\.", "").replaceAll("\\:", "").replaceAll(" ", "");
			this.insertPeriodM1(db, time, k0[1], k0[2], k0[3], k0[4]);
		}else{
			System.out.println("内存数据未读取到");
		}
	}
	
	/**
	 * 向M1周期表插入数据
	 */
	public void insertPeriodM1(MySql_DB db, String time, String open, String close, String high, String low){
		//如果time不存在则新增，如果存在则更新
		if(Data.dBHandler.isUniqueTime(this.tab, Long.valueOf(time))){
			System.out.println("---------->" + time);
			long cno = DBHandler.getMaxCno(this.tab)+1;
			String sql = "insert into " + this.tab + " (cno,time,open,close,high,low) values(" + cno + "," + time + "," + open + "," + close + "," + high + "," + low  + ")";
			db.executeUpdate(sql);
		}else{
			this.updateM1Data(db, time, open, close, high, low);
		}
	}
	
	/**
	 * 向M1周期表更新数据
	 */
	public void updateM1Data(MySql_DB db, String time, String open, String close, String high, String low){
		String sql = "update " + this.tab + "  set open = " + open + ", close=" + close + ",high=" + high+ ",low=" + low + " where time =" + time;
		db.executeUpdate(sql);
	}
	
	public static void main(String[] args){
		String str = "2010.06.02 00:00:00|1.22123000|1.22120000|1.22123000|1.22120000_2010.06.01 23:59:00|1.22100000|1.22122000|1.22132000|1.22100000";
		//ObjPool pool = ObjPool.getSingleInstance();
		MySql_DB db = MySql_DB.getSingleInstance();
		CreatPeriodM1.getSingleInstance().creatPeriods(db,str);
		//pool.release(db);
	}
}
