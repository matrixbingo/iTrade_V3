package ea.service.res.data;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;


import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.FxMod;
import ea.service.utils.base.Mark;

/**
 * 分笔数据
 * @author Liang.W.William
 */
public class FxData {
	
	private static FxData singleInstance = null;
	private int size = 10;
	private HashMap<Integer,FenBiInfoDto> if01Map = null;
	private HashMap<Integer,FenBiInfoDto> if05Map = null;
	private HashMap<Integer,FenBiInfoDto> if10Map = null;
	private HashMap<Integer,FenBiInfoDto> if30Map = null;
	
	private HashMap<String,FenBiInfoDto> sf01Map = null;
	private HashMap<String,FenBiInfoDto> sf05Map = null;
	private HashMap<String,FenBiInfoDto> sf10Map = null;
	private HashMap<String,FenBiInfoDto> sf30Map = null;

	private FenBiInfoDto dto = null;
	private List<FxMod> list = null;
	
	private Iterator<FxMod> it = null;
	private FxMod fxMod = null;
	private Object key = null;
	
	public static FxData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (FxData.class) {
				if (singleInstance == null) {
					singleInstance = new FxData();
				}
			}
		}
		return singleInstance;
	}
	
	private FxData(){
		this.if01Map = new HashMap<Integer,FenBiInfoDto>();
		this.if05Map = new HashMap<Integer,FenBiInfoDto>();
		this.if10Map = new HashMap<Integer,FenBiInfoDto>();
		this.if30Map = new HashMap<Integer,FenBiInfoDto>();
		
		this.sf01Map = new HashMap<String,FenBiInfoDto>();
		this.sf05Map = new HashMap<String,FenBiInfoDto>();
		this.sf10Map = new HashMap<String,FenBiInfoDto>();
		this.sf30Map = new HashMap<String,FenBiInfoDto>();
	}
	
	
	/**
	 * 根据CNO,得到笔段信息
	 */
	final public FenBiInfoDto getFxBiInfo(int period, int cno){
		this.dto = null;
		switch(period){
			case Mark.Period_M01	 :	this.dto = this.getPutMap(this.if01Map, period, true, cno, null);
				break;
			case Mark.Period_M05	 :	this.dto = this.getPutMap(this.if05Map, period, true, cno, null);
				break;
			case Mark.Period_M10 :	this.dto = this.getPutMap(this.if10Map, period, true, cno, null);
				break;
			case Mark.Period_M30 :	this.dto = this.getPutMap(this.if30Map, period, true, cno, null);
				break;	
		}
		return dto;
	}
	
	/**
	 * 根据time,得到笔段信息
	 */
	final public FenBiInfoDto getFxBiInfo(int period, Long time){
		this.dto = null;
		switch(period){
			case Mark.Period_M01	 :	this.dto = this.getPutMap(this.sf01Map, period, true, null, time);
				break;
			case Mark.Period_M05	 :	this.dto = this.getPutMap(this.sf05Map, period, true, null, time);
				break;
			case Mark.Period_M10 :	this.dto = this.getPutMap(this.sf10Map, period, true, null, time);
				break;
			case Mark.Period_M30 :	this.dto = this.getPutMap(this.sf30Map, period, true, null, time);
				break;	
		}
		return this.dto;
	}
	
	/**
	 * 根据time或cno,得到笔段信息
	 */
	final private FenBiInfoDto getFenBiInfoDto(int period, boolean isTest, Integer cno, Long time){
		this.dto = new FenBiInfoDto(period);
		int topbtm = 0, num = 1;
		this.list = Data.getDataControl.getFenBiInfoByType(period, isTest, cno, time);
		this.it = this.list.iterator();
		try{
			this.fxMod = null;
	    	while(this.it.hasNext()){
	    		this.fxMod = this.it.next();
	    		switch (num) {
					case 1:
							topbtm = this.fxMod.getTopbtm();
							if(topbtm == -1){
								this.dto.setDir(Mark.From_Btm);		//low
							}else if(topbtm == 1){
								this.dto.setDir(Mark.From_Top);		//top
							}
							this.dto.setC1(this.fxMod.getCno()); this.dto.setP1(this.fxMod.getPrice()); this.dto.setT1(this.fxMod.getTime());
						break;
					case 2:	this.dto.setC2(this.fxMod.getCno()); this.dto.setP2(this.fxMod.getPrice()); this.dto.setT2(this.fxMod.getTime());
						break;
					case 3:	this.dto.setC3(this.fxMod.getCno()); this.dto.setP3(this.fxMod.getPrice()); this.dto.setT3(this.fxMod.getTime());
						break;
					case 4:	this.dto.setC4(this.fxMod.getCno()); this.dto.setP4(this.fxMod.getPrice()); this.dto.setT4(this.fxMod.getTime());
						break;
					case 5:	this.dto.setC5(this.fxMod.getCno()); this.dto.setP5(this.fxMod.getPrice()); this.dto.setT5(this.fxMod.getTime());
						break;
					case 6:	this.dto.setC6(this.fxMod.getCno()); this.dto.setP6(this.fxMod.getPrice()); this.dto.setT6(this.fxMod.getTime());
						break;
				}
	    		num++;
	    	}
		}catch(Exception e){
			Controller.log.error("Error ---> : FxData.getFenBiInfoDtoByType");
		}
		this.dto.setPeriod(period);
		this.dto.setSize(num-1);
		return this.dto;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	final private FenBiInfoDto getPutMap(HashMap map, int period, boolean isTest, Integer cno, Long time){
		this.dto = null;
		this.key = (null != cno)?cno:time;
		if(map.containsKey(key)){
			return (FenBiInfoDto) map.get(this.key);
		}else if( map.size() == 0 || !map.containsKey(this.key)){
			this.dto = this.getFenBiInfoDto(period, isTest, cno, time);
			map.put(this.key, this.dto);
		}else if(map.size() > this.size){
			map.clear();
			this.dto = this.getFenBiInfoDto(period, isTest, cno, time);
			map.put(this.key, this.dto);
		}
		return this.dto;
	}
	
}
