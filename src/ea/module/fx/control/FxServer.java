package ea.module.fx.control;

import java.util.HashMap;


import ea.server.Controller;
import ea.service.res.dto.CandlesDto;
import ea.service.utils.base.Mark;

public abstract class FxServer {
	//--- 存储cno为key的分页数据
	private HashMap<Integer, CandlesDto> map_01 = null, map_05 = null, map_10 = null, map_30 = null, map_60 = null, map_240 = null;
	
	/**
	 * 初始化Fx所需数据
	 */
	public void initMapByPeriod(int period){
		if(Controller.isMeFx){
			switch(period){
				case Mark.Period_M01 : this.map_01 = new HashMap<Integer,CandlesDto>();
					break;
				case Mark.Period_M05 : this.map_05 = new HashMap<Integer,CandlesDto>();
					break;
				case Mark.Period_M10 : this.map_10 = new HashMap<Integer,CandlesDto>();
					break;
				case Mark.Period_M30 : this.map_30 = new HashMap<Integer,CandlesDto>();
					break;
				case Mark.Period_H01 : this.map_60 = new HashMap<Integer,CandlesDto>();
					break;
				case Mark.Period_H04 : this.map_240 = new HashMap<Integer,CandlesDto>();
					break;
			}
		}
	}

	public void addDtoByPeriod(int period, CandlesDto dto){
		if(Controller.isMeFx){
			switch(period){
				case Mark.Period_M01 : this.map_01.put(dto.getCno(), dto);
					break;
				case Mark.Period_M05 : this.map_05.put(dto.getCno(), dto);
					break;
				case Mark.Period_M10 : this.map_10.put(dto.getCno(), dto);
					break;
				case Mark.Period_M30 : this.map_30.put(dto.getCno(), dto);
					break;
				case Mark.Period_H01 : this.map_60.put(dto.getCno(), dto);
					break;
				case Mark.Period_H04 : this.map_240.put(dto.getCno(), dto);
					break;
			}
		}
	}
	
	public HashMap<Integer,CandlesDto> getMapByPeriod(int period){
		switch(period){
			case Mark.Period_M01 : return this.map_01;
			case Mark.Period_M05 : return this.map_05;
			case Mark.Period_M10 : return this.map_10;
			case Mark.Period_M30 : return this.map_30;
			case Mark.Period_H01 : return this.map_60;
			case Mark.Period_H04 : return this.map_240;
		}
		return null;
	}
	
	protected String getKey(CandlesDto dto) {
		return new StringBuffer().append(dto.getPeriod()).append(dto.getCno()).append(dto.getDir()).toString();
	}
}
