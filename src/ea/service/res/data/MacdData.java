package ea.service.res.data;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;


import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.macd.MacdDto;
import ea.service.res.dto.macd.MacdMod;
import ea.service.res.dto.macd.MacdPointDto;
import ea.service.utils.base.Mark;

/**
 * MACD数据
 * @author Liang.W.William
 */
public class MacdData {
	
	private int size = 0;
	
	private HashMap<String,MacdDto> ma05Map = null;
	private HashMap<String,MacdDto> ma10Map = null;
	private HashMap<String,MacdDto> ma30Map = null;
	private static MacdData singleInstance = null;
	
	private MacdDto dto = null;
	private MacdPointDto mh = null, ml = null;
	private List<MacdMod> list = null;
	
	public static MacdData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (MacdData.class) {
				if (singleInstance == null) {
					singleInstance = new MacdData();
				}
			}
		}
		return singleInstance;
	}
	
	private MacdData(){
		ma05Map = new HashMap<String,MacdDto>();
		ma10Map = new HashMap<String,MacdDto>();
		ma30Map = new HashMap<String,MacdDto>();
	}
	/**
	 * 得到笔段信息
	 */
	final public MacdDto initMacdExt(FenBiInfoDto fxDto){
		int period = fxDto.getPeriod();
		MacdDto dto = null;
		switch(period){
			case Mark.Period_M05	 :	dto = this.getPutMap(this.ma05Map, fxDto);
				break;
			case Mark.Period_M10 :	dto = this.getPutMap(this.ma10Map, fxDto);
				break;	
			case Mark.Period_M30 :	dto = this.getPutMap(this.ma30Map, fxDto);
				break;	
		}
		return dto;
	}

	/**
	 * 初始化分段对应MACD最大值数据 和 最小值数据
	 */
	final private MacdDto getRangeMacdExt(FenBiInfoDto fxDto){
		this.dto	= new MacdDto();
		this.mh		= new MacdPointDto();
		this.ml		= new MacdPointDto();
		this.list	= Data.getDataControl.getRangeMacdExt(Controller.t_macd, fxDto);
		Iterator<MacdMod> it = this.list.iterator();
		MacdMod mod = null;
		while(it.hasNext()){
    		mod = (MacdMod)it.next();
    		int row = mod.getRow();
    		switch(row){
    			case 1 : this.mh.setF1(mod.getMax()); this.ml.setF1(mod.getMin());
    				break;
    			case 2 : this.mh.setF2(mod.getMax()); this.ml.setF2(mod.getMin());
					break;
    			case 3 : this.mh.setF3(mod.getMax()); this.ml.setF3(mod.getMin());
					break;
    			case 4 : this.mh.setF4(mod.getMax()); this.ml.setF4(mod.getMin());
					break;
    			case 5 : this.mh.setF5(mod.getMax()); this.ml.setF5(mod.getMin());
					break;
    		}
    	}
		
		this.dto.setMh(this.mh);
		this.dto.setMl(this.ml);
		return this.dto;
	}
	
	final private MacdDto getPutMap(HashMap<String,MacdDto> map, FenBiInfoDto fxDto){
		MacdDto dto = null;
		String key = fxDto.getC1() + "_" + fxDto.getC2() + "_" + fxDto.getC3() + "_" + fxDto.getC4();
		if(map.containsKey(key)){
			return (MacdDto) map.get(key);
		}else if( map.size() == 0 || !map.containsKey(key)){
			dto = this.getRangeMacdExt(fxDto);
			map.put(key, dto);
		}else if(map.size() > this.size){
			map.clear();
			dto = this.getRangeMacdExt(fxDto);
			map.put(key, dto);
		}
		return dto;
	}
}
