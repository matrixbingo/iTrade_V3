package ea.service.res.data;

import java.util.HashMap;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.InMarketDto;
import ea.service.utils.base.Mark;

/**
 * 已废弃
 */
public class InBrkMarketData {

	private static InBrkMarketData singleInstance = null;
	private HashMap<String, InMarketDto> map = new HashMap<String, InMarketDto>();
	private InMarketDto dto = null;
	private FenBiInfoDto a = null, b = null;
	
	public static InBrkMarketData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (InBrkMarketData.class) {
				if (singleInstance == null) {
					singleInstance = new InBrkMarketData();
				}
			}
		}
		return singleInstance;
	}
	
	final public void addInMarketDto(int version, int dir, int type, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05){
		this.dto = new InMarketDto(version, dir, type);
		this.dto.setDto_dvt_05(dto_dvt_05);
		this.dto.setDto_dvt_10(dto_dvt_10);
		this.dto.setDto_dvt_30(dto_dvt_30);
		this.map.put(this.getKey(version, dir, type), this.dto);
	}
	
	final public void checkIn(int version, int dir, int type, BreakDto dto_brk){
		this.dto = this.map.get(this.getKey(version, dir, type));
		if(null != this.dto && this.dto.getState() != 1){
			switch(dto_brk.getPeriod()){
				case Mark.Period_M05  : this.checkBeiliDto(this.dto, dto_brk, this.dto.getDto_dvt_05());
					break;
				case Mark.Period_M10 : this.checkBeiliDto(this.dto, dto_brk, this.dto.getDto_dvt_10());
					break;
				case Mark.Period_M30 : this.checkBeiliDto(this.dto, dto_brk, this.dto.getDto_dvt_30());
					break;
			}
		}
	}
	
	final private void checkBeiliDto(InMarketDto dto, BreakDto ab, BeiliDto bd){
		this.a = ab.getFxDto();
		this.b = bd.getFxDto();
		if(this.a.getPeriod() == this.b.getPeriod() && this.a.getC1() == this.b.getC1() && this.a.getC2() == this.b.getC2() && this.a.getC3() == this.b.getC3() && this.a.getC4() == this.b.getC4()){
			Data.inOrderManager.inMarketByType(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v04, dto.getDto_dvt_30(), dto.getDto_dvt_10(), dto.getDto_dvt_05(), Data.conditionManager.getDto_k_01());
			dto.setState(1);
		}
	}
	final private String getKey(int version, int dir, int type){
		return new StringBuffer().append(version).append("_").append(dir).append("_").append(type).toString();
	}
}
