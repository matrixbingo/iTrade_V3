package ea.service.res.dto;

import ea.service.res.dto.macd.MacdDto;

public class FxMacdDto {
	private FenBiInfoDto f_dto = null;
	private MacdDto		 m_dto = null;
	
	final public FenBiInfoDto getF_dto() {
		return this.f_dto;
	}
	final public void setF_dto(FenBiInfoDto f_dto) {
		this.f_dto = f_dto;
	}
	final public MacdDto getM_dto() {
		return this.m_dto;
	}
	final public void setM_dto(MacdDto m_dto) {
		this.m_dto = m_dto;
	}
}
