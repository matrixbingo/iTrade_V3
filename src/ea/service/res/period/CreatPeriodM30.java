package ea.service.res.period;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import ea.server.Data;
import ea.service.res.db.dao.MySql_DB;
import ea.service.res.dto.CandlesDto;

/**
 * 根据M10计算M30
 * @author Liang.W.William
 *
 */
public class CreatPeriodM30 {
	
	private final int period_M30 = 30;			//30分钟周期
	private final int period_M30_Minus = -30;		//减去30分
	private static CreatPeriodM30 singleInstance = null; //唯一实例 

	/**
	 * 返回唯一实例。如果是第一次调用此方法，则创建实例
	 */
	public static CreatPeriodM30 getSingleInstance(){
		if (singleInstance == null) {
			synchronized (CreatPeriodM30.class) {
				if (singleInstance == null) {
					singleInstance = new CreatPeriodM30();
				}
			}
		}
		return singleInstance;
	}
	/**
	 * 根据M10刷新M30
	 * @param db_sys
	 * @throws SQLException
	 */
	public void creatPeriods(MySql_DB db_sys) {
		String sql = "select min(time) tmin,max(time) tmax from t_candle_10";
		ResultSet rs = db_sys.executeQuery(sql);
		String tmin = null,tmax = null;
		//得到时间的最大和最小值
		try {
			while(rs.next()){
				tmin = rs.getString("tmin");
				tmax = rs.getString("tmax");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		//计算M30
		this.creatPeriodM30(db_sys, Util.str2Calendar(tmin), Util.str2Calendar(tmax));
	}
	
	/**
	 * 按开始和结束时间，计算时间区间， 时间区间为  20110801000501 <---> 20110801001000
	 * @param db_sys
	 * @param tmin
	 * @param tmax
	 * @throws SQLException
	 */
	public void creatPeriodM30(MySql_DB db_sys,Calendar tmin,Calendar tmax) {
		
//		Calendar a = Util.str2Calendar("20110801000103");	//测试用
//		Calendar b = Util.str2Calendar("20110801115000");
		
		Calendar a = this.checkLastTime_M30(db_sys,tmin);
		Calendar b = tmax;
		
		Calendar[] znoes = Util.getBeginZoneByPeriod(a, Util.TimeZone_M30);
		Calendar end = Util.getEndZoneByPeriod(b, Util.TimeZone_M30);
		
		Calendar t1 = znoes[0];
		Calendar t2 = znoes[1];
		
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");//yyyy-MM-dd HH:mm:ss
		
		CandlesDto k = computePeriodM30(db_sys,df.format(t1.getTime()),df.format(t2.getTime()));
		//System.out.println(df.format(t1.getTime()) + " <---> " + df.format(t2.getTime()));
		if(k != null){
			this.insertPeriodM30(db_sys, k);
		}
		
		while(end.after(t2)){
			t1.add(Calendar.MINUTE, this.period_M30);
			t2.add(Calendar.MINUTE, this.period_M30);
			k = computePeriodM30(db_sys,df.format(t1.getTime()),df.format(t2.getTime()));
			//System.out.println(df.format(t1.getTime()) + " <---> " + df.format(t2.getTime()));
			if(k != null){
				this.insertPeriodM30(db_sys, k);
			}
		}
	}
	/**
	 * 根据时间区间计算M30,20110801000501 <---> 20110801001000
	 * @param db_History
	 * @param db_sys
	 * @param tmin
	 * @param tmax
	 * @throws SQLException
	 */
	public CandlesDto computePeriodM30(MySql_DB db_sys, String bigen, String end) {
		CandlesDto k = new CandlesDto();
		
		String sql = "select cno, time, open, close, high,low from t_candle_10 where time >= " + bigen + " and time <= " + end + " ORDER BY time";
		ResultSet rs = db_sys.executeQuery(sql);
		ArrayList<Double> hlist = new ArrayList<Double>();
		ArrayList<Double> llist = new ArrayList<Double>();
		double open = 0,close = 0,high = 0,low = 0;
		int flag = 1;
		
		try {
			while(rs.next()){
				hlist.add(rs.getDouble("high"));
				llist.add(rs.getDouble("low"));
				if(flag == 1){
					open = rs.getDouble("open");
				}
				close = rs.getDouble("close");
				flag++;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		if(flag != 1){
			high = Util.getPriceMost(hlist)[0];
			low = Util.getPriceMost(llist)[1];
			
			k.setTime(end);
			k.setOpen(open);
			k.setClose(close);
			k.setHigh(high);
			k.setLow(low);
		}else if(flag == 1){
			k = null;
		}
		//System.out.println("M30--->" + end + " " + open + " " + close + " " + high + " " + low);
		return k;
	}
	/**
	 * 向M30周期表插入数据
	 * @param db_sys
	 * @param k
	 */
	public void insertPeriodM30(MySql_DB db_sys, CandlesDto k){
		//如果time不存在则新增，如果存在则更新
		if(!Data.dBHandler.isUniqueTime("t_candle_30", k.getTime())){
			long cno = Data.dBHandler.getMaxNum("t_candle_30");
			cno = cno + 1;
			String sql = "insert into t_candle_30 (cno,time,open,close,high,low) values(" + cno + "," + k.getTime() + "," + k.getOpen() + "," + k.getClose() + "," + k.getHigh() + "," + k.getLow()  + ")";
			db_sys.executeUpdate(sql);
		}else{
			this.updateM30Data(db_sys, k);
		}

	}
	/**
	 * 每次运行先更新最后一条数据，再返回开始时间
	 * @param db_sys
	 * @param k
	 */
	public Calendar checkLastTime_M30(MySql_DB db_sys,Calendar tmin){
		String tmax = Data.dBHandler.getMaxTime("t_candle_30");
		if(tmax != null){
			tmin = Util.str2Calendar(tmax);
			Calendar a = Util.str2Calendar(tmax);
			a.add(Calendar.MINUTE, this.period_M30_Minus);
			String bigen = Util.calendar2Str(a,Util.Calendar2Str);
			Calendar b = Util.str2Calendar(bigen);
			b.add(Calendar.SECOND, 1);
			this.updatePeriodM30(db_sys, b, tmin);	//每次运行先更新最后一条数据
		}
		return tmin;
	}
	/**
	 * 
	 * @param db_sys
	 * @param tmin
	 * @param tmax
	 * @throws SQLException
	 */
	public void updatePeriodM30(MySql_DB db_sys,Calendar t1,Calendar t2) {
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
		CandlesDto k = computePeriodM30(db_sys,df.format(t1.getTime()),df.format(t2.getTime()));
		//System.out.println(df.format(t1.getTime()) + " <---> " + df.format(t2.getTime()));
		if(k != null){
			this.updateM30Data(db_sys, k);
		}
	}
	public void updateM30Data(MySql_DB db_sys, CandlesDto k){
		long cno = Data.dBHandler.getCno("t_candle_30");
		String sql = "update t_candle_30  set open = " + k.getOpen() + ", close=" + k.getClose() + ",high=" + k.getHigh() + ",low=" + k.getLow() + " where cno=" + cno;
		db_sys.executeUpdate(sql);
	}

	public static void main(String[] args)  {
		CreatPeriodM30 c = new CreatPeriodM30();
//		MySql_BD db_History = new MySql_BD();
//		MySql_BD db_sys = new MySql_BD();
//		

//		String bigen = "20110830221501";	//测试用
//		String end = "20110830222000";
//		
//		c.computePeriodM10( db_History,  db_sys,  bigen,  end);
//		
//		db_History.close();
//		db_sys.close();

		MySql_DB db = MySql_DB.getSingleInstance();
		c.creatPeriods(db);

	}
}
