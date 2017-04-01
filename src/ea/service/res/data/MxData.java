package ea.service.res.data;

import java.util.HashMap;

import ea.server.Data;
import ea.service.res.dto.CandlesDto;
import ea.service.utils.base.Mark;

/**
 * 基本不用
 */
public class MxData {
	private int size = 10;
	private Integer new_m5_cno = null;
	private CandlesDto dto = null;
	private HashMap<Integer,CandlesDto> if05Map = null;
	private static MxData singleInstance = null;
	
	public static MxData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (MxData.class) {
				if (singleInstance == null) {
					singleInstance = new MxData();
				}
			}
		}
		return singleInstance;
	}
	private MxData(){
		if05Map = new HashMap<Integer,CandlesDto>();
	}
	/**
	 * 	根据5分钟cno得到一分钟candle
	 
	final public CandlesDto getM1CandleByM5Cno(int cno){
		CandlesDto dto = this.getPutMap(this.if05Map, Mark.Period_M5, cno);
		if(null == dto){
			Controller.log.info("MiData.getM1CandleByM5Cno----------> 1分钟缺失对应5分钟CNO:" + cno + "对应数据，使用5分钟数据返回负数");
			return Data.miData.getMiKDataByPeriod(Mark.Period_M5, cno);
		}else{
			return dto;
		}
	}*/
	/**
	 * 得到最新
	 */
	final public CandlesDto getM1CandleByM5Cno(){
		if(null != this.new_m5_cno){
			return this.getPutMap(this.if05Map, Mark.Period_M05, this.new_m5_cno);
		}
		return null;
	}
	
	final private CandlesDto getPutMap(HashMap<Integer,CandlesDto> map, int period, Integer cno){
		this.dto = null;
		if(map.containsKey(cno)){
			return map.get(cno);
		}else if( map.size() == 0 || !map.containsKey(cno)){
			this.dto = this.getCandlesDtoByPeriod(period, cno);
			this.setNew(period, cno);
			map.put(cno, this.dto);
		}else if(map.size() > this.size){
			map.clear();
			this.dto = this.getCandlesDtoByPeriod(period, cno);
			this.setNew(period, cno);
			map.put(cno, this.dto);
		}
		return this.dto;
	}
	
	final private CandlesDto getCandlesDtoByPeriod(int period, int cno){
		switch(period){
			//case Mark.Period_M1	 :	if(cno != Mark.No_cno)this.new_m1_cno = cno;
		
			case Mark.Period_M05	 :	return Data.getDataControl.getM1CandleByM5Cno(cno);
		}
		return null;
	}
	final private void setNew(int period, Integer cno){
		switch(period){
			//case Mark.Period_M1	 :	if(cno != Mark.No_cno)this.new_m1_cno = cno;
			//	break;
			case Mark.Period_M05	 :	if(cno != Mark.No_Cno)this.new_m5_cno = cno;
				break;
		}
	}
}
