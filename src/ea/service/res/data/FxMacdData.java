package ea.service.res.data;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import ea.server.Data;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.res.dto.macd.MacdDto;
import ea.service.res.dto.macd.MacdPointDto;
import ea.service.utils.base.Mark;

public class FxMacdData {
	private static FxMacdData singleInstance = null;
	private FenBiInfoDto f_dto = null;
	private MacdDto		 m_dto = null;
	private BaseDto		 b_dto = null;
	private MacdPointDto mh = null, ml = null;
	private FxMacdDto fm_dto = null;
	private Iterator<BaseDto> it = null;
	private List<BaseDto> list = null;
	private HashMap<String,MacdDto> macd_map = null;
	private HashMap<String,FenBiInfoDto> fx_map = null;
	private String key = null;
	private int fx_cno_05 = 0,fx_cno_10 = 0, fx_cno_30 = 0; 
	
	private int i = 1;
	public static FxMacdData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (FxMacdData.class) {
				if (singleInstance == null) {
					singleInstance = new FxMacdData();
				}
			}
		}
		return singleInstance;
	}
	
	private FxMacdData(){
		this.macd_map 	= new HashMap<String,MacdDto>();
		this.fx_map 	= new HashMap<String,FenBiInfoDto>();
	}
	
	final public FxMacdDto initFxMacdInfo(int period, int cno){
		Data.conditionManager.setCnoByPeriod(period, cno);
		this.list = Data.exeDataControl.exeFx(period, cno, this.getCno(period));
		if(null == this.list || this.list.isEmpty()){
			return null;
		}else if(this.list.get(0).getType() == 0){
			return null;
		}
		return this.initfxMacdDto(period, cno, list);
	}
	
	final public FenBiInfoDto getFxDto(int period, int cno){	
		return this.fx_map.get(new StringBuffer().append(period).append("_").append(cno).toString());
	}

	final public MacdDto getMacdDto(int period, int cno){
		return this.macd_map.get(new StringBuffer().append(period).append("_").append(cno).toString());
	}
	/**
	 * 出现新的分笔时计算
	 */
	final private FxMacdDto initfxMacdDto(int period, int cno, List<BaseDto> list){
		this.i  = 1;
		this.mh	= new MacdPointDto();
		this.ml	= new MacdPointDto();
		this.f_dto = new FenBiInfoDto(period);
		this.fm_dto = new FxMacdDto();
		this.it = list.iterator();
		this.m_dto = new MacdDto();
		
		while(this.it.hasNext()){
    		this.b_dto = this.it.next();
    		switch(this.i){
				case 1 : this.mh.setF1(this.b_dto.getMax()); this.ml.setF1(this.b_dto.getMin());
					break;
				case 2 : this.mh.setF2(this.b_dto.getMax()); this.ml.setF2(this.b_dto.getMin());
					break;
				case 3 : this.mh.setF3(this.b_dto.getMax()); this.ml.setF3(this.b_dto.getMin());
					break;
				case 4 : this.mh.setF4(this.b_dto.getMax()); this.ml.setF4(this.b_dto.getMin());
					break;
				case 5 : this.mh.setF5(this.b_dto.getMax()); this.ml.setF5(this.b_dto.getMin());
					break;
				case 6 : this.f_dto.setDir(this.b_dto.getQ0());
						 this.f_dto.setC1((int)this.b_dto.getQ1()); this.f_dto.setC2((int)this.b_dto.getQ2()); this.f_dto.setC3((int)this.b_dto.getQ3());
						 this.f_dto.setC4((int)this.b_dto.getQ4()); this.f_dto.setC5((int)this.b_dto.getQ5()); this.f_dto.setC6((int)this.b_dto.getQ6());
					break;
				case 7 : this.f_dto.setSize(this.b_dto.getQ0());
						 this.f_dto.setT1((long)this.b_dto.getQ1()); this.f_dto.setT2((long)this.b_dto.getQ2()); this.f_dto.setT3((long)this.b_dto.getQ3());
						 this.f_dto.setT4((long)this.b_dto.getQ4()); this.f_dto.setT5((long)this.b_dto.getQ5()); this.f_dto.setT6((long)this.b_dto.getQ6());
					break;
				case 8 : this.f_dto.setP1(this.b_dto.getQ1()); this.f_dto.setP2(this.b_dto.getQ2()); this.f_dto.setP3(this.b_dto.getQ3());
				         this.f_dto.setP4(this.b_dto.getQ4()); this.f_dto.setP5(this.b_dto.getQ5()); this.f_dto.setP6(this.b_dto.getQ6());;
					break;
    		}
    		this.i++;
    	}

		this.m_dto.setMh(this.mh);
		this.m_dto.setMl(this.ml);
		this.setFxMap(period, cno);
		this.fm_dto.setF_dto(this.f_dto);
		this.fm_dto.setM_dto(this.m_dto);
		Data.conditionManager.addFmDto(this.fm_dto);
		this.setCno(period, this.f_dto.getC1());
		return this.fm_dto;
	}
	
	final private void setFxMap(int period, int cno){
		this.key = new StringBuffer().append(period).append("_").append(cno).toString();
		this.fx_map.put(this.key, this.f_dto);
		this.macd_map.put(this.key, this.m_dto);
			
		if(this.fx_map.size() > 100){
			 this.fx_map.clear();
		}
		if(this.macd_map.size() > 100){
			 this.macd_map.clear();
		}
	}
	
	final private int getCno(int period){
		switch(period){
			case Mark.Period_M05 	: return this.fx_cno_05;
			case Mark.Period_M10 	: return this.fx_cno_10; 
			case Mark.Period_M30 	: return this.fx_cno_30; 
		}
		return 0;
	}
	
	final private void setCno(int period, int cno){
		switch(period){
			case Mark.Period_M05 	: this.fx_cno_05 = cno;
			case Mark.Period_M10 	: this.fx_cno_10 = cno;
			case Mark.Period_M30 	: this.fx_cno_30 = cno; 
		}
	}
}
