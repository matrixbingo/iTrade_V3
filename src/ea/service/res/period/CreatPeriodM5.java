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
 * 根据M1计算M5
 * @author Liang.W.William
 */
public class CreatPeriodM5 {
	
	private final int period_M5 = 5;			//5分钟周期
	private final int period_M5_Minus = -5;		//减去60分
	private static CreatPeriodM5 singleInstance = null;

	/**
	 * 返回唯一实例。如果是第一次调用此方法，则创建实例
	 */
	public static CreatPeriodM5 getSingleInstance(){
		if (singleInstance == null) {
			synchronized (CreatPeriodM5.class) {
				if (singleInstance == null) {
					singleInstance = new CreatPeriodM5();
				}
			}
		}
		return singleInstance;
	}
	/**
	 * 根据M1刷新M5
	 * @param db_sys
	 * @throws SQLException
	 */
	public void creatPeriods(MySql_DB dataUtil){
		String sql = "select min(time) tmin,max(time) tmax from t_candle";
		ResultSet rs = dataUtil.executeQuery(sql);
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
	
		//计算M5
		this.creatPeriodM5(dataUtil, Util.str2Calendar(tmin), Util.str2Calendar(tmax));
	}
	
	/**
	 * 按开始和结束时间，计算时间区间， 时间区间为  20110801000501 <---> 20110801001000
	 * @param db_sys
	 * @param tmin
	 * @param tmax
	 * @throws SQLException
	 */
	public void creatPeriodM5(MySql_DB db_sys,Calendar tmin,Calendar tmax){
		
//		Calendar a = Util.str2Calendar("20110801000100");	//测试用
//		Calendar b = Util.str2Calendar("20110801015000");
		
		Calendar a = this.checkLastTime_M5(db_sys,tmin);
		Calendar b = tmax;
		
		Calendar[] znoes = Util.getBeginZoneByPeriod(a, Util.TimeZone_M5);
		Calendar end = Util.getEndZoneByPeriod(b, Util.TimeZone_M5);
		
		Calendar t1 = znoes[0];
		Calendar t2 = znoes[1];
		
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");//yyyy-MM-dd HH:mm:ss
		
		CandlesDto k = computePeriodM5(db_sys,df.format(t1.getTime()),df.format(t2.getTime()));
		//System.out.println(df.format(t1.getTime()) + " <---> " + df.format(t2.getTime()));
		if(k != null){
			this.insertPeriodM5(db_sys, k);
		}
		
		while(end.after(t2)){
			t1.add(Calendar.MINUTE, this.period_M5);
			t2.add(Calendar.MINUTE, this.period_M5);
			k = computePeriodM5(db_sys,df.format(t1.getTime()),df.format(t2.getTime()));
			//System.out.println(df.format(t1.getTime()) + " <---> " + df.format(t2.getTime()));
			if(k != null){
				this.insertPeriodM5(db_sys, k);
			}
		}
	}
	/**
	 * 根据时间区间计算M5,20110801000501 <---> 20110801001000
	 * @param db_History
	 * @param db_sys
	 * @param tmin
	 * @param tmax
	 * @throws SQLException
	 */
	public CandlesDto computePeriodM5(MySql_DB db_sys, String begin, String end){
		CandlesDto k = new CandlesDto();
		String sql = "select cno, time, open, close, high,low from t_candle where time >= " + begin + " and time <= " + end + " ORDER BY time";
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
		//System.out.println("M5--->" + end + " " + open + " " + close + " " + high + " " + low);
		return k;
	}
	
	/**
	 * 向M5周期表插入数据
	 * @param db_sys
	 * @param k
	 */
	public void insertPeriodM5(MySql_DB db_sys, CandlesDto k){
		//如果time不存在则新增，如果存在则更新
		if(!Data.dBHandler.isUniqueTime("t_candle_05", k.getTime())){
			long cno = Data.dBHandler.getMaxNum("t_candle_05");
			cno = cno + 1;
			String sql = "insert into t_candle_05(cno,time,open,close,high,low) values(" + cno + "," + k.getTime() + "," + k.getOpen() + "," + k.getClose() + "," + k.getHigh() + "," + k.getLow()  + ")";
			db_sys.executeUpdate(sql);
			System.out.println(sql);
		}else{
			this.updateM5Data(db_sys, k);
		}
	}
	/**
	 * 每次运行先更新最后一条数据，再返回开始时间
	 * @param db_sys
	 * @param k
	 */
	public Calendar checkLastTime_M5(MySql_DB db_sys,Calendar tmin){
		String tmax = Data.dBHandler.getMaxTime("t_candle_05");
		if(tmax != null){
			tmin = Util.str2Calendar(tmax);
			Calendar a = Util.str2Calendar(tmax);
			a.add(Calendar.MINUTE, this.period_M5_Minus);
			String begin = Util.calendar2Str(a,Util.Calendar2Str);
			Calendar b = Util.str2Calendar(begin);
			b.add(Calendar.SECOND, 1);
			this.updatePeriodM5(db_sys, b, tmin);	//每次运行先更新最后一条数据
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
	public void updatePeriodM5(MySql_DB db_sys,Calendar t1,Calendar t2){
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
		CandlesDto k = computePeriodM5(db_sys,df.format(t1.getTime()),df.format(t2.getTime()));
		//System.out.println(df.format(t1.getTime()) + " <---> " + df.format(t2.getTime()));
		if(k != null){
			this.updateM5Data(db_sys, k);
		}
	}
	public void updateM5Data(MySql_DB db_sys, CandlesDto k){
		long cno = Data.dBHandler.getCno("t_candle_05");
		String sql = "update t_candle_05  set open = " + k.getOpen() + ", close=" + k.getClose() + ",high=" + k.getHigh() + ",low=" + k.getLow() + " where cno=" + cno;
		db_sys.executeUpdate(sql);
	}

	public static void main(String[] args){
		CreatPeriodM5 c = new CreatPeriodM5();
//		MySql_BD db_History = new MySql_BD();
//		MySql_BD db_sys = new MySql_BD();
//		

//		String begin = "20110830221501";	//测试用
//		String end = "20110830222000";
//		
//		c.computePeriodM5( db_History,  db_sys,  begin,  end);
//		
//		db_History.close();
//		db_sys.close();

		MySql_DB db = MySql_DB.getSingleInstance();
		c.creatPeriods(db);

	}
}
