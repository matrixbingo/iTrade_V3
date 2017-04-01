package ea.service.res.data.condition.control;

import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;

public abstract class ConditionFxServer {
	private int period,  updn;
	private BeiliDto beili_m05_top 		= null;
	private BeiliDto beili_m05_bot 		= null;
	private BeiliDto beili_m10_top 		= null;
	private BeiliDto beili_m10_bot	 	= null;
	private BeiliDto beili_m30_top 		= null;
	private BeiliDto beili_m30_bot 		= null;
	
	private FxMacdDto fm_dto_m05		= null;
	private FxMacdDto fm_dto_m10		= null;
	private FxMacdDto fm_dto_m30		= null;
	
	public FxMacdDto getFmDtoByPeriod(int period){
		switch(period){
			case Mark.Period_M05  : return this.fm_dto_m05;
			case Mark.Period_M10 : return this.fm_dto_m10;
			case Mark.Period_M30 : return this.fm_dto_m30;
		}
		return null;
	}
	final public void addFmDto(FxMacdDto fmDto){
		switch(fmDto.getF_dto().getPeriod()){
			case Mark.Period_M05  : this.fm_dto_m05 = fmDto;
			case Mark.Period_M10 : this.fm_dto_m10 = fmDto;
			case Mark.Period_M30 : this.fm_dto_m30 = fmDto;
		}
	}
	/**
	 * 添加到DTO
	 */
	final protected void addBeili(BeiliDto dto){
		this.period = dto.getPeriod();
		this.updn = dto.getUpdn();
		switch(this.period){
			case Mark.Period_M05 : 
				switch(this.updn){
					case Mark.Beili_Bot : this.setBeili_m05_bot(dto);
						break;
					case Mark.Beili_Top : this.setBeili_m05_top(dto);
						break;
				}
				break;
			case Mark.Period_M10 : 
				switch(this.updn){
					case Mark.Beili_Bot : this.setBeili_m10_bot(dto);
						break;
					case Mark.Beili_Top : this.setBeili_m10_top(dto);
						break;
				}
				break;
			case Mark.Period_M30 : 
				switch(this.updn){
					case Mark.Beili_Bot : this.setBeili_m30_bot(dto);
						break;
					case Mark.Beili_Top : this.setBeili_m30_top(dto);
						break;
				}
				break;
		}
	}

	public BeiliDto getBeili_m05_top() {
		return beili_m05_top;
	}

	public void setBeili_m05_top(BeiliDto beili_m05_top) {
		this.beili_m05_top = beili_m05_top;
	}

	public BeiliDto getBeili_m05_bot() {
		return beili_m05_bot;
	}

	public void setBeili_m05_bot(BeiliDto beili_m05_bot) {
		this.beili_m05_bot = beili_m05_bot;
	}

	public BeiliDto getBeili_m10_top() {
		return beili_m10_top;
	}

	public void setBeili_m10_top(BeiliDto beili_m10_top) {
		this.beili_m10_top = beili_m10_top;
	}

	public BeiliDto getBeili_m10_bot() {
		return beili_m10_bot;
	}

	public void setBeili_m10_bot(BeiliDto beili_m10_bot) {
		this.beili_m10_bot = beili_m10_bot;
	}

	public BeiliDto getBeili_m30_top() {
		return beili_m30_top;
	}

	public void setBeili_m30_top(BeiliDto beili_m30_top) {
		this.beili_m30_top = beili_m30_top;
	}

	public BeiliDto getBeili_m30_bot() {
		return beili_m30_bot;
	}

	public void setBeili_m30_bot(BeiliDto beili_m30_bot) {
		this.beili_m30_bot = beili_m30_bot;
	}
}
