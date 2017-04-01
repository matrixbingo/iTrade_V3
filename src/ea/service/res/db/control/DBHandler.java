package ea.service.res.db.control;

import java.sql.ResultSet;
import java.sql.SQLException;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.db.dao.DBComm;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;

@SuppressWarnings("unused")
public class DBHandler{
	
	private static DBHandler singleInstance = null;
	private BaseDto dto = null;
	private FxMacdDto rs = null;
	private int bin_cno = 0, end_cno = 0 , cno_30_c1 = 0;
	public static DBHandler getSingleInstance(){
		if (singleInstance == null) {
			synchronized (DBHandler.class) {
				if (singleInstance == null) {
					singleInstance = new DBHandler();
				}
			}
		}
		return singleInstance;
	}
	
	/**
	 * 清空所有表数据
	 */
	final public void clearTabs(){
		String[] clearTabs = Controller.clearTabs.split("\\.");
		for(int i=0 ; i<clearTabs.length ; i++){
			Data.exeDataControl.truncateTable(clearTabs[i]);
		}
		Data.exeDataControl.truncateTable(Controller.t_trade);
	}
	/**
	 * 变更所有表的存储引擎
	 */
	final public void changeEngine(String type){
		String[] clearTabs = Controller.clearTabs.split("\\.");
		for(int i=0 ; i<clearTabs.length ; i++){
			Data.exeDataControl.changeEngine(clearTabs[i], type);
		}
		//Data.exeDataControl.changeEngine(Controller.t_macd, type);
		Data.exeDataControl.changeEngine(Controller.t_trade, type);
	}
	/**
	 * 按年保存数据
	 */
	final public void saveTab(String year){
		String[] tabs = Controller.saveTab.split("\\.");
		for(int i=0 ; i<tabs.length ; i++){
			Data.exeDataControl.saveTable(tabs[i], year);
		}
	}
	/**
	 * 根据周期和CNO刷新分笔数据
	 */
	final public void createFx_M01(int cno){
		//Data.exeDataControl.exeFx(Mark.Period_M1, cno);
	}
	final public FxMacdDto createFx_M05(int cno_k_05){
		if(cno_k_05 >= 145){
			//System.out.println(11111);
		}
		
		return Data.fxMacdData.initFxMacdInfo(Mark.Period_M05, cno_k_05);
		//Data.utilModule.clearRemark();
	}
	final public FxMacdDto createFx_M10(int cno_k_10){

		return Data.fxMacdData.initFxMacdInfo(Mark.Period_M10, cno_k_10);
	}
	final public FxMacdDto createFx_M30(int cno_k_30){
		/*this.rs =  Data.fxMacdData.initFxMacdInfo(Mark.Period_M30, cno_k_30);
		if(null != this.rs && this.rs.getF_dto().getSize() > 3 && this.rs.getF_dto().getC1() != this.cno_30_c1){
			
			this.end_cno = Data.pageManager.getCandlesDtoByTime(Mark.Period_M10, this.rs.getF_dto().getT1()).getCno();
			this.bin_cno = Data.pageManager.getCandlesDtoByTime(Mark.Period_M10, this.rs.getF_dto().getT3()).getCno();
			Data.fxManager.getFxMacdDto(Mark.Period_M10, this.rs.getF_dto().getDir(), this.bin_cno, this.end_cno);	
			this.cno_30_c1 = this.rs.getF_dto().getC1();
			
			this.end_cno = this.rs.getF_dto().getC1() + 20;
			this.bin_cno = this.rs.getF_dto().getC3();
			Data.fxManager.getFxMacdDto(Mark.Period_M30, this.rs.getF_dto().getType(), this.bin_cno, this.end_cno);
			this.cno_30_c1 = this.rs.getF_dto().getC1();
			
		}*/
		
		return Data.fxMacdData.initFxMacdInfo(Mark.Period_M30, cno_k_30);
	}
	
	
/*	final public CandlesDto getM1CandleByM5Cno(int cno){
		if(Controller.isExactM5){
			return Data.miData.getMiKDataByPeriod(Mark.Period_M5, cno);//如果精确到5分钟，直接取值
		}else{
			return Data.mxData.getM1CandleByM5Cno(cno);	//如果精确到1分钟，则取5分钟对应的一分钟值，没有则取5分钟
		}
	}*/
	
	
	/**
	 * 得到行数
	 */
	final public int getCno(String tabName){
		int num = Data.getDataControl.getCount(tabName);
		if(num == 0){
			return 1;
		}
		return num;
	}
	final public int getMaxNum(String tabName){
		return Data.getDataControl.getMaxCno(tabName);
	}
	
	/**
	 * 得到表的总行数
	 */
	final public int getCount(String table){
		return Data.getDataControl.getCount(table);
	}
	
	/**
	 * 得到最大id值
	 */
	final public int getMaxId(String tabName){
		return Data.getDataControl.getMaxId(tabName);
	}

	/**
	 * 判断时间是否存在
	 */
	final public boolean isUniqueTime(String tabName, long time){
		return Data.getDataControl.isUniqueTime(tabName, time);
	}
	
	/**
	 * 得到t_clear表已经刷新的数据量
	 * @param period
	 * @return
	 */
	final public int getClearNumByPeriod(int period){
		return Data.getDataControl.getClearNumByPeriod(period);
	}

	/**
	 * 根据周期和时间得到对应的CNO
	 */
	final public int getCnoByTime(int period, long time){
		String table = Util.getTabNameByPeriod(period);
		return Data.getDataControl.getCnoByTime(table, time);
	}
	/**
	 * 根据周期和时间得到对应的CNO
	 */
	final public static String getTimeByCno(int cno, String tabName){
		String time = null;
		String sql = "select time from " + tabName + " where cno = " + cno;
		ResultSet rs = DBComm.executeQuery(sql);
		try {
			while(rs.next()){
				time = rs.getString("time");
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
		return time;
	}
	/**
	 * 添加背离标示
	 
	final public static void addRemark(int period, int cno, int type, int dir, String time, double price, String query, String updata){
		String sql = "insert into t_remark(period,cno,type,dir,time,price) values(" + period + "," + cno + "," + type + "," + dir + "," + time + "," + price + ")";
		if(!Data.getDataControl.isExistRemark(period, cno, type, dir)){
			ExeDataControl.addRemark(period, cno, type, dir, time, price, 0);		//插入
		}else{
			DBHandler.executeUpdate(updata);	//更新
		}
	}
	
	
	final public static long getIdByCno(String query){
		return DBHandler.getNum(query, "id");
	}
	*/
	

	/**
	 * 根据表数据刷新分笔数据:一次性刷新完分笔 : 未使用
	 */
	final public void createFxBiDuanByPeriod(int period){		
		String tab = Util.getTabNameByPeriod(period);
		//得到tab表的最大序号
		int max = this.getCno(tab);
		int clearNum = this.getClearNumByPeriod(period)+1;

		long in = 1;
		
		if(clearNum < max){
			try {
				for(int i=clearNum ; i<=max ; i++){
					Data.exeDataControl.exeFx(period, i, 0);
					in++;
				}
			}catch (Exception e) {
				e.printStackTrace();
				Controller.log.debug("运行出错：DBHandler.createFxBiDuanByPeriod 分笔运行到" + in + "出错~");
			}
		}
	}
	
	/**
	 * 得到最大行数
	 */
	public static long getMaxCno(String tabName){
		long cno = 1;
		String sql = "select max(cno) cno from " + tabName;
		ResultSet rs = DBComm.executeQuery(sql);
		try {
			while(rs.next()){
				cno = rs.getLong("cno");
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
		return cno;
	}
	
	/**
	 * 得到时间最大值
	 */
	public String getMaxTime(String tabName){
		this.dto = Data.getDataControl.getMaxMinTime(tabName);
		if(null == this.dto || this.dto.getBin() == 0){
			return null;
		}
		return String.valueOf(this.dto.getEnd());
	}
	
	final public static void main(String args[]) {
		//DBHandler.clearRemarkBeili(0, 0);
		//DBHandler.clearRemarkBeili(Mark.Period_M5, 0);
		//DBHandler.clearRemarkBeili(Mark.Period_M5, 6);
		//double p2 = InfaceDB.getSection(Mark.Period_M30, "20120904071100").getBot_price();
		//int cno = DBHandler.getCnoByTime(1, "20120904071100");
		
	} 
}
