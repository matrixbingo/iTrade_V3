package test.PageManager;

import ea.server.CreatIndicator;
import ea.server.Data;
import ea.service.res.data.page.PageManager;
import ea.service.res.data.page.futrue.PageManagerNew;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.CandlesDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.TimeStamp;
import ea.service.utils.comm.Util;
import ea.tactics.server.ServerIndex;

import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

/**
 * 测试用
 */
public class Common {

	@SuppressWarnings("unused")
	private int i = 0, num = 0, year = 0, month = 0, date = 0, hour = 0, minute = 0, cno = Mark.No_Cno;
	private long bin = 0, end = 0;
	private CandlesDto dto = null;
	private BaseDto b_dto = null;
	private boolean flag = false;
	private Iterator<BaseDto> it = null;
	private BaseDto bdto = null;
	
	final private void checkList(List<BaseDto> list, long bin_time, Calendar bin_cal){
		this.it = list.iterator();
		while(it.hasNext()){
			this.bdto = it.next();
			if(bin_time > this.bdto.getBin() && bin_time < this.bdto.getEnd()){
				this.setTime(bin_cal, String.valueOf(this.bdto.getEnd()));
				this.it.remove();
				this.flag = true;
				return;
			}
		}
	}
	
	final private void setTime(Calendar time, String end){
		this.year 	= Integer.valueOf(end.substring(0,4));
		this.month 	= Integer.valueOf(end.substring(4,6))-1;
		this.date 	= Integer.valueOf(end.substring(6,8));
		this.hour	= Integer.valueOf(end.substring(8,10));
		this.minute = Integer.valueOf(end.substring(10,12));
		time.set(year, month, date, hour, minute, 0);
	}
	
	final private void checkStopTime(List<BaseDto> list, int list_size, long bin_time, Calendar bin_cal){
		if(this.i >= list_size){
			return;
		}
		this.b_dto = list.get(this.i);
		this.bin = this.b_dto.getBin();
		this.end = this.b_dto.getEnd();
		if(this.bin >= bin_time){
			return;
		}
		if(bin_time > bin && bin_time < end){
			this.setTime(bin_cal, String.valueOf(this.end));
			this.i++;
			this.flag = true;
			return;
		}
		if(bin_time == this.end){
			return;
		}
		if(bin_time > this.end){
			this.checkList(list, bin_time, bin_cal);
		}
	}
	/**
	 * 运行策略组,每分钟逐步计算
	 */
	final private void runEa(long time){
		if(this.flag){
			this.flag = false;
			return;
		}
		//this.dto = PageManagerNew.getSingleInstance().getCandlesDtoByTime(Mark.Period_M01, time);

		this.dto = PageManager.getSingleInstance().getCandlesDtoByTime(Mark.Period_M01, time);
		
		if(null == this.dto){
			
			//System.out.println("M01 lost -----> " + time);
			
		}else{
			this.num++;
			//System.out.println(this.num + " : exe - " + this.dto.getCno() + " : " + this.dto.getTime());
			
		}
		ServerIndex.getSingleInstance().runIndex(this.dto, time);
	}
	
	final public void runtime(){
		BaseDto dto = Data.getDataControl.getMaxMinTime("t_candle");
		Calendar bin = Util.lng2Calendar(dto.getBin());
		Calendar end = Util.lng2Calendar(dto.getEnd());
		List<BaseDto> list = Data.getDataControl.getStopTimeByYear(bin.get(Calendar.YEAR));
		int list_size = list.size();
		long bin_time = 0;
		while(bin.before(end)){
			bin_time = Util.calendar2Lng(bin);
			this.checkStopTime(list, list_size, bin_time, bin);
			this.runEa(bin_time);
			bin.add(Calendar.MINUTE, 1);
		}
		runEa(Util.calendar2Lng(bin));
	}
	
	/**
	 * 实时
	 */
	final public void run(){
		new CreatIndicator().creatIndicatorCurr();
		Data.pageManager.clearAll();
		long time = Long.valueOf(Data.dBHandler.getMaxTime("t_candle"));
		this.runEa(time);
	}
	
	public static void main(String[] args) {
		Data.dBHandler.clearTabs();				//清空表
		Data.dBHandler.changeEngine("MEMORY");	//MEMORY,MyISAM

		Common c = new Common();
		TimeStamp t = TimeStamp.getSingleInstance();
		
		c.runtime();
		
		String runtime = t.stop();
		System.out.println("程序运行时间： " + runtime);
		Data.dBHandler.changeEngine("InnoDB");
		//Data.dBHandler.saveTab("2012");
		//new Shutdown().shutdown();
	}
}
