package ea.service.res.data;

import java.util.HashMap;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.CandlesDto;
import ea.service.utils.base.Mark;

/**
 * M1 k线数据 已废弃
 * @author Liang.W.William
 */
public class MiData {

	private int size = 0;
	private Integer new_m1_cno, new_m5_cno = null;
	private String new_m1_time, new_m5_time = null;
	private HashMap<Integer,CandlesDto> if01Map = null;
	private HashMap<Integer,CandlesDto> if05Map = null;
	
	private HashMap<String,CandlesDto> sf01Map = null;
	private HashMap<String,CandlesDto> sf05Map = null;

	private static MiData singleInstance = null;
	
	public static MiData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (MiData.class) {
				if (singleInstance == null) {
					singleInstance = new MiData();
				}
			}
		}
		return singleInstance;
	}
	
	private MiData(){
		if01Map = new HashMap<Integer,CandlesDto>();
		if05Map = new HashMap<Integer,CandlesDto>();
		sf01Map = new HashMap<String,CandlesDto>();
		sf05Map = new HashMap<String,CandlesDto>();
	}
	

	
	/**
	 * 根据period,CNO得到K线数据
	 */
	final public CandlesDto getMiKDataByPeriod(int period, int cno){
		CandlesDto dto = null;
/*		switch(period){
			case Mark.Period_M1	 :	dto = this.getPutMap(this.if01Map, period, true, cno, Mark.Time_1900);
				break;
			case Mark.Period_M5	 :	dto = this.getPutMap(this.if05Map, period, true, cno, Mark.Time_1900);
				break;	
		}*/
		if(null == dto){
			Controller.log.info("MiData.getMiKDataByPeriod:数据出错 周期："+period + " cno:" + cno);
		}
		return dto;
	}
	
	/**
	 * 根据period,Time得到K线数据
	 */
	final public CandlesDto getMiKDataByPeriod(int period, String time){
		CandlesDto dto = null;
		switch(period){
			case Mark.Period_M01	 :	dto = this.getPutMap(this.sf01Map, period, true, Mark.No_Cno, time);
				break;
			case Mark.Period_M05	 :	dto = this.getPutMap(this.sf05Map, period, true, Mark.No_Cno, time);
				break;
		}
		return dto;
	}
	/**
	 * 得到最新一分钟candle
	 */
	final public CandlesDto getM1KData(){
		CandlesDto dto_cno, dto_tim = null;
		if(null != this.new_m1_cno && null != this.new_m1_time){
			dto_cno = this.if01Map.get(this.new_m1_cno);
			dto_tim = this.sf01Map.get(this.new_m1_time);
			if(dto_cno.getCno() > dto_tim.getCno()){
				return dto_cno;
			}else{
				return dto_tim;
			}
		}else if(null != this.new_m1_cno && null == this.new_m1_time){
			return this.if01Map.get(this.new_m1_cno);
		}else if(null == this.new_m1_cno && null != this.new_m1_time){
			return this.sf01Map.get(this.new_m1_time);
		}
		return null;
	}
	/**
	 * 得到最新五分钟candle
	 */
	final public CandlesDto getM5KData(){
		CandlesDto dto_cno, dto_tim = null;
		if(null != this.new_m5_cno && null != this.new_m5_time){
			dto_cno = this.if05Map.get(this.new_m5_cno);
			dto_tim = this.sf05Map.get(this.new_m5_time);
			if(dto_cno.getCno() > dto_tim.getCno()){
				return dto_cno;
			}else{
				return dto_tim;
			}
		}else if(null != this.new_m5_cno && null == this.new_m5_time){
			return this.if05Map.get(this.new_m5_cno);
		}else if(null == this.new_m5_cno && null != this.new_m5_time){
			return this.sf05Map.get(this.new_m5_time);
		}
		return null;
	}
	/**
	 * 得到最新一分钟k线数据
	 * @param isTest false：实际环境 ture：测试环境 
	 * @param cno:M1的CNO
	 */
	final private CandlesDto getMiCandleData(int period, boolean isTest, int cno, String time){
		return Data.getDataControl.getCandle(period, isTest, cno, time);
	}
		
	@SuppressWarnings({ "rawtypes", "unchecked" })
	final private CandlesDto getPutMap(HashMap map, int period, boolean isTest, Integer cno, String time){
		CandlesDto dto = null;
		Object key = (cno != Mark.No_Cno)?cno:time;
		if(map.containsKey(key)){
			return (CandlesDto) map.get(key);
		}else if( map.size() == 0 || !map.containsKey(key)){
			dto = this.getMiCandleData(period, isTest, cno, time);
			this.setNew(period, cno, time);
			map.put(key, dto);
		}else if(map.size() > this.size){
			map.clear();
			dto = this.getMiCandleData(period, isTest, cno, time);
			this.setNew(period, cno, time);
			map.put(key, dto);
		}
		return dto;
	}
	
	final private void setNew(int period, Integer cno, String time){
		switch(period){
/*			case Mark.Period_M1	 :	if(cno != Mark.No_Cno)this.new_m1_cno = cno; if(!time.equals(Mark.Time_1900))this.new_m1_time = time;
				break;
			case Mark.Period_M5	 :	if(cno != Mark.No_Cno)this.new_m5_cno = cno; if(!time.equals(Mark.Time_1900))this.new_m5_time = time;
				break;*/
		}
	}
}
