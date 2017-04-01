package ea.module.beili.control;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;

public abstract class BeiLiServer {
	protected int Beili_M5_Top_1 = 0, Beili_M5_Top_2 = 0, Beili_M5_Bot_1 = 0, Beili_M5_Bot_2 = 0;
	protected int Beili_M10_Top_1 = 0, Beili_M10_Top_2 = 0, Beili_M10_Bot_1 = 0, Beili_M10_Bot_2 = 0;
	protected int Beili_M30_Top_1 = 0, Beili_M30_Top_2 = 0, Beili_M30_Bot_1 = 0, Beili_M30_Bot_2 = 0;
	
	/**
	 * 未使用，已舍弃
	 *
	public BeiliDto isBeiLiByPeriod(int period, int cno, CandlesDto kData) {
		return this.isBeiLiByPeriod(period, null, cno, kData);
	}
	/**
	 * 未使用，已舍弃
	 *
	public BeiliDto isBeiLiByPeriod(int period, long time, CandlesDto kData) {
		return this.isBeiLiByPeriod(period, time, 0, kData);
	}
	/**
	 * 判断是否背离：得到背离DTO
	 * @param period:M1,M5,M10,M30,H1
	 */
	final public BeiliDto getBeiliDtoByPeriod(int period, long time, CandlesDto dto_k_m01, FxMacdDto fm_dto) {
		//this.fxDto = Data.fxdata.getFxBiInfo(period, time);
		
		if(null != fm_dto && fm_dto.getF_dto().getSize() > 6){
			if(null != dto_k_m01){
				return this.switchPeriod(period, fm_dto, dto_k_m01);
			}else{
				return this.switchPeriod(period, fm_dto, Data.pageManager.getCandlesDtoByTime(period, time));
			}
		}
		return null;
	}
	
/*	private BeiliDto isBeiLiByPeriod(int period, Long time, int cno, CandlesDto kData) {
		FenBiInfoDto fxDto = null;
		if(null != time){
			fxDto = Data.fxdata.getFxBiInfo(period, time);
		}else{
			fxDto = Data.fxdata.getFxBiInfo(period, cno);
		}
		if(null != fxDto && fxDto.getSize() > 5){
			return this.switchPeriod(period, fxDto, kData);
		}
		return null;
	}*/
	
	final protected BeiliDto switchPeriod(int period, FxMacdDto fm_dto, CandlesDto kData){
		//根据第一个顶点高低类型,判断是否背离
		switch(period){
			case Mark.Period_M05  : return this.isBeiLiByM05(fm_dto, kData);
			
			case Mark.Period_M10 : return this.isBeiLiByM10(fm_dto, kData);
				
			case Mark.Period_M30 : return this.isBeiLiByM30(fm_dto, kData);
		}
		return null;
	}
	
	protected abstract BeiliDto isBeiLiByM05(FxMacdDto fm_dto, CandlesDto kData);
	
	protected abstract BeiliDto isBeiLiByM10(FxMacdDto fm_dto, CandlesDto kData);
	
	protected abstract BeiliDto isBeiLiByM30(FxMacdDto fm_dto, CandlesDto kData);
}
