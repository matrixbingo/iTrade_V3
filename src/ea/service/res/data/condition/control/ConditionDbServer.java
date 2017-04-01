package ea.service.res.data.condition.control;

import ea.service.res.dto.BaseDto;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;

public abstract class ConditionDbServer {

	private BeiliDto beili_m05_top1 	= null;	// 1
	private BeiliDto beili_m05_top2 	= null;	// 2
	private BeiliDto beili_m05_bot1 	= null;	// 3
	private BeiliDto beili_m05_bot2 	= null;	// 4
	private BeiliDto beili_m10_top1 	= null;	// 5
	private BeiliDto beili_m10_top2 	= null;	// 6 
	private BeiliDto beili_m10_bot1 	= null;	// 7
	private BeiliDto beili_m10_bot2 	= null;	// 8
	private BeiliDto beili_m30_top1 	= null;	// 9
	private BeiliDto beili_m30_top2 	= null;	// 10
	private BeiliDto beili_m30_bot1 	= null;	// 11
	private BeiliDto beili_m30_bot2 	= null;	// 12
	
	private BreakDto break_m01_top  	= null;	// 13
	private BreakDto break_m01_top1 	= null;	// 14
	private BreakDto break_m01_top2 	= null;	// 15
	private BreakDto break_m01_bot 		= null;	// 16
	private BreakDto break_m01_bot1 	= null;	// 17
	private BreakDto break_m01_bot2 	= null;	// 18
	private BreakDto break_m05_top1 	= null;	// 19
	private BreakDto break_m05_top2 	= null;	// 20
	private BreakDto break_m05_bot1 	= null;	// 21
	private BreakDto break_m05_bot2 	= null;	// 22
	private BreakDto break_m10_top1 	= null;	// 23
	private BreakDto break_m10_top2 	= null;	// 24
	private BreakDto break_m10_bot1 	= null;	// 25
	private BreakDto break_m10_bot2 	= null;	// 26
	
	private BreakDto break_m05_bot 		= null;	// 27
	private BreakDto break_m05_top 		= null;	// 28
	private BreakDto break_m10_bot 		= null;	// 29
	private BreakDto break_m10_top 		= null;	// 30
	
	private BreakDto break_m05m10_bot	= null;	// 31
	private BreakDto break_m05m10_top 	= null;	// 32
	
	private BeiliDto beili_m05_top 		= null;	// 33
	private BeiliDto beili_m05_bot 		= null;	// 34
	private BeiliDto beili_m10_top 		= null;	// 35
	private BeiliDto beili_m10_bot	 	= null;	// 36
	private BeiliDto beili_m30_top 		= null;	// 37
	private BeiliDto beili_m30_bot 		= null;	// 38
	
	private FxMacdDto fm_dto_m05		= null;
	private FxMacdDto fm_dto_m10		= null;
	private FxMacdDto fm_dto_m30		= null;
	
	private CandlesDto dto_k_01			= null;
	
	private int cno_k_05 = 0, cno_k_10 = 0, cno_k_30 = 0;
	
	public FxMacdDto getFmDtoByPeriod(int period){
		switch(period){
			case Mark.Period_M05  : return this.fm_dto_m05;
			case Mark.Period_M10 : return this.fm_dto_m10;
			case Mark.Period_M30 : return this.fm_dto_m30;
		}
		return null;
	}
	
	public void clearRemarkDto(BaseDto dto){
		int type = dto.getNum(), period = dto.getPeriod(), cno = dto.getCno(), dir = dto.getDir(), updn = dto.getUpdn();
		switch(type){
			case Mark.Action_Type_beili : this.clearBeiliDto(period, updn, dir, cno);
				break;
			case Mark.Action_Type_break : this.clearBreakDto(period, updn, dir, cno);
				break;
		}
	}

	private void clearBeiliDto(int period, int updn, int cno, int dir){
		switch(period){
			case Mark.Period_M05 : 
				switch(updn){
					case  Mark.Beili_Top : 
						switch(dir){
							case Mark.Beili_Dir_1 : this.beili_m05_top1 = null;
								break;
							case Mark.Beili_Dir_2 : this.beili_m05_top2 = null;
								break;
						}
					break;
					case  Mark.Beili_Bot : 
						switch(dir){
							case Mark.Beili_Dir_1 : this.beili_m05_bot1 = null;
								break;
							case Mark.Beili_Dir_2 : this.beili_m05_bot2 = null;
								break;
						}
					break;
				}
				break;
			case Mark.Period_M10 : 
				switch(updn){
					case  Mark.Beili_Top : 
						switch(dir){
							case Mark.Beili_Dir_1 : this.beili_m10_top1 = null;
								break;
							case Mark.Beili_Dir_2 : this.beili_m10_top2 = null;
								break;
						}
					break;
					case  Mark.Beili_Bot : 
						switch(dir){
							case Mark.Beili_Dir_1 : this.beili_m10_bot1 = null;
								break;
							case Mark.Beili_Dir_2 : this.beili_m10_bot2 = null;
								break;
						}
					break;
				}
				break;
			case Mark.Period_M30 : 
				switch(updn){
					case  Mark.Beili_Top : 
						switch(dir){
							case Mark.Beili_Dir_1 : this.beili_m30_top1 = null;
								break;
							case Mark.Beili_Dir_2 : this.beili_m30_top2 = null;
								break;
						}
					break;
					case  Mark.Beili_Bot : 
						switch(dir){
							case Mark.Beili_Dir_1 : this.beili_m30_bot1 = null;
								break;
							case Mark.Beili_Dir_2 : this.beili_m30_bot2 = null;
								break;
						}
					break;
				}
				break;
		}
	}
	private void clearBreakDto(int period, int updn, int cno, int dir){
		switch(period){
			case Mark.Period_M01 : 
				switch(updn){
				case  Mark.Break_Top : 
					switch(dir){
						case Mark.Break_Dir_1 : this.break_m01_top1 = null;
							break;
						case Mark.Break_Dir_2 : this.break_m01_top2 = null;
							break;
					}
				break;
				case  Mark.Break_Bot : 
					switch(dir){
						case Mark.Break_Dir_1 : this.break_m01_bot1 = null;
							break;
						case Mark.Break_Dir_2 : this.break_m01_bot2 = null;
							break;
					}
				break;
			}
			break;
			case Mark.Period_M05 : 
				switch(updn){
					case  Mark.Break_Top : 
						switch(dir){
							case Mark.Break_Dir_1 : this.break_m05_top1 = null;
								break;
							case Mark.Break_Dir_2 : this.break_m05_top2 = null;
								break;
						}
					break;
					case  Mark.Break_Bot : 
						switch(dir){
							case Mark.Break_Dir_1 : this.break_m05_bot1 = null;
								break;
							case Mark.Break_Dir_2 : this.break_m05_bot2 = null;
								break;
						}
					break;
				}
				break;
			case Mark.Period_M10 : 
					switch(updn){
					case  Mark.Break_Top : 
						switch(dir){
							case Mark.Break_Dir_1 : this.break_m10_top1 = null;
								break;
							case Mark.Break_Dir_2 : this.break_m10_top2 = null;
								break;
						}
					break;
					case  Mark.Break_Bot : 
						switch(dir){
							case Mark.Break_Dir_1 : this.break_m10_bot1 = null;
								break;
							case Mark.Break_Dir_2 : this.break_m10_bot2 = null;
								break;
						}
					break;
				}
				break;
		}
	}
	final protected void addBreak(BreakDto dto){
		int period = dto.getPeriod(), updn = dto.getUpdn(), dir = dto.getDir();
		switch(period){
		case Mark.Period_M01 : 
			if(updn == Mark.Break_Bot){
				switch(dir){
					case Mark.Break_Dir_1:this.setBreak_m01_bot1(dto); break;
					case Mark.Break_Dir_2:this.setBreak_m01_bot2(dto); break;
				}
			}else if(updn == Mark.Break_Top){
				switch(dir){
					case Mark.Break_Dir_1:this.setBreak_m01_top1(dto); break;
					case Mark.Break_Dir_2:this.setBreak_m01_top2(dto); break;
				}
			}
			break;
		case Mark.Period_M05 : 
			if(updn == Mark.Break_Bot){
				switch(dir){
					case Mark.Break_Dir_1:this.setBreak_m05_bot1(dto); break;
					case Mark.Break_Dir_2:this.setBreak_m05_bot2(dto); break;
				}
			}else if(updn == Mark.Break_Top){
				switch(dir){
					case Mark.Break_Dir_1:this.setBreak_m05_top1(dto); break;
					case Mark.Break_Dir_2:this.setBreak_m05_top2(dto); break;
				}
			}
			break;
		case Mark.Period_M10 : 
			if(updn == Mark.Break_Bot){
				switch(dir){
					case Mark.Break_Dir_1:this.setBreak_m10_bot1(dto); break;
					case Mark.Break_Dir_2:this.setBreak_m10_bot2(dto); break;
				}
			}else if(updn == Mark.Break_Top){
				switch(dir){
					case Mark.Break_Dir_1:this.setBreak_m10_top1(dto); break;
					case Mark.Break_Dir_2:this.setBreak_m10_top2(dto); break;
				}
			}
			break;
		}
	}
	
	/**
	 * 添加到DTO
	 */
	final protected void addBeili(BeiliDto dto){
		int period = dto.getPeriod(), updn = dto.getUpdn(), dir = dto.getDir();
		switch(period){
			case Mark.Period_M05 : 
				if(updn == Mark.Beili_Bot){
					switch(dir){
						case Mark.Beili_Dir_1:this.setBeili_m05_bot1(dto); break;
						case Mark.Beili_Dir_2:this.setBeili_m05_bot2(dto); break;
					}
				}else if(updn == Mark.Beili_Top){
					switch(dir){
						case Mark.Beili_Dir_1:this.setBeili_m05_top1(dto); break;
						case Mark.Beili_Dir_2:this.setBeili_m05_top2(dto); break;
					}
				}
				break;
			case Mark.Period_M10 : 
				if(updn == Mark.Beili_Bot){
					switch(dir){
						case Mark.Beili_Dir_1:this.setBeili_m10_bot1(dto); break;
						case Mark.Beili_Dir_2:this.setBeili_m10_bot2(dto); break;
					}
				}else if(updn == Mark.Beili_Top){
					switch(dir){
						case Mark.Beili_Dir_1:this.setBeili_m10_top1(dto); break;
						case Mark.Beili_Dir_2:this.setBeili_m10_top2(dto); break;
					}
				}
				break;
			case Mark.Period_M30 : 
				if(updn == Mark.Beili_Bot){
					switch(dir){
						case Mark.Beili_Dir_1:this.setBeili_m30_bot1(dto); break;
						case Mark.Beili_Dir_2:this.setBeili_m30_bot2(dto); break;
					}
				}else if(updn == Mark.Beili_Top){
					switch(dir){
						case Mark.Beili_Dir_1:this.setBeili_m30_top1(dto); break;
						case Mark.Beili_Dir_2:this.setBeili_m30_top2(dto); break;
					}
				}
				break;
		}
	}
	
	final public void addFmDto(FxMacdDto fmDto){
		switch(fmDto.getF_dto().getPeriod()){
			case Mark.Period_M05  : this.fm_dto_m05 = fmDto;
			case Mark.Period_M10 : this.fm_dto_m10 = fmDto;
			case Mark.Period_M30 : this.fm_dto_m30 = fmDto;
		}
	}
	final public BeiliDto getBeili_m05_top1() {
		return beili_m05_top1;
	}
	public void setBeili_m05_top1(BeiliDto beili_m05_top1) {
		this.beili_m05_top1 = beili_m05_top1;
		this.beili_m05_top = beili_m05_top1;
	}
	public BeiliDto getBeili_m05_top2() {
		return beili_m05_top2;
	}
	public void setBeili_m05_top2(BeiliDto beili_m05_top2) {
		this.beili_m05_top2 = beili_m05_top2;
		this.beili_m05_top = beili_m05_top2;
	}
	public BeiliDto getBeili_m05_bot1() {
		return beili_m05_bot1;
	}
	public void setBeili_m05_bot1(BeiliDto beili_m05_bot1) {
		this.beili_m05_bot1 = beili_m05_bot1;
		this.beili_m05_bot = beili_m05_bot1;
	}
	public BeiliDto getBeili_m05_bot2() {
		return beili_m05_bot2;
	}
	public void setBeili_m05_bot2(BeiliDto beili_m05_bot2) {
		this.beili_m05_bot2 = beili_m05_bot2;
		this.beili_m05_bot = beili_m05_bot2;
	}
	public BeiliDto getBeili_m10_top1() {
		return beili_m10_top1;
	}
	public void setBeili_m10_top1(BeiliDto beili_m10_top1) {
		this.beili_m10_top1 = beili_m10_top1;
		this.beili_m10_top = beili_m10_top1;
	}
	public BeiliDto getBeili_m10_top2() {
		return beili_m10_top2;
	}
	public void setBeili_m10_top2(BeiliDto beili_m10_top2) {
		this.beili_m10_top2 = beili_m10_top2;
		this.beili_m10_top = beili_m10_top2;
	}
	public BeiliDto getBeili_m10_bot1() {
		return beili_m10_bot1;
	}
	public void setBeili_m10_bot1(BeiliDto beili_m10_bot1) {
		this.beili_m10_bot1 = beili_m10_bot1;
		this.beili_m10_bot = beili_m10_bot1;
	}
	public BeiliDto getBeili_m10_bot2() {
		return beili_m10_bot2;
	}
	public void setBeili_m10_bot2(BeiliDto beili_m10_bot2) {
		this.beili_m10_bot2 = beili_m10_bot2;
		this.beili_m10_bot = beili_m10_bot2;
	}
	public BeiliDto getBeili_m30_top1() {
		return beili_m30_top1;
	}
	public void setBeili_m30_top1(BeiliDto beili_m30_top1) {
		this.beili_m30_top1 = beili_m30_top1;
		this.beili_m30_top = beili_m30_top1;
	}
	public BeiliDto getBeili_m30_top2() {
		return beili_m30_top2;
	}
	public void setBeili_m30_top2(BeiliDto beili_m30_top2) {
		this.beili_m30_top2 = beili_m30_top2;
		this.beili_m30_top = beili_m30_top2;
	}
	public BeiliDto getBeili_m30_bot1() {
		return beili_m30_bot1;
	}
	public void setBeili_m30_bot1(BeiliDto beili_m30_bot1) {
		this.beili_m30_bot1 = beili_m30_bot1;
		this.beili_m30_bot = beili_m30_bot1;
	}
	public BeiliDto getBeili_m30_bot2() {
		return beili_m30_bot2;
	}
	public void setBeili_m30_bot2(BeiliDto beili_m30_bot2) {
		this.beili_m30_bot2 = beili_m30_bot2;
		this.beili_m30_bot = beili_m30_bot2;
	}
	public BreakDto getBreak_m01_top1() {
		return break_m01_top1;
	}
	public void setBreak_m01_top1(BreakDto break_m01_top1) {
		this.break_m01_top1 = break_m01_top1;
		this.break_m01_top = break_m01_top1;
	}
	public BreakDto getBreak_m01_top2() {
		return break_m01_top2;
	}
	public void setBreak_m01_top2(BreakDto break_m01_top2) {
		this.break_m01_top2 = break_m01_top2;
		this.break_m01_top = break_m01_top2;
	}
	public BreakDto getBreak_m01_bot1() {
		return break_m01_bot1;
	}
	public void setBreak_m01_bot1(BreakDto break_m01_bot1) {
		this.break_m01_bot1 = break_m01_bot1;
		this.break_m01_bot = break_m01_bot1;
	}
	public BreakDto getBreak_m01_bot2() {
		return break_m01_bot2;
	}
	public void setBreak_m01_bot2(BreakDto break_m01_bot2) {
		this.break_m01_bot2 = break_m01_bot2;
		this.break_m01_bot = break_m01_bot2;
	}
	public BreakDto getBreak_m05_top1() {
		return break_m05_top1;
	}
	public void setBreak_m05_top1(BreakDto break_m05_top1) {
		this.break_m05_top1 = break_m05_top1;
		this.break_m05_top = break_m05_top1;
	}
	public BreakDto getBreak_m05_top2() {
		return break_m05_top2;
	}
	public void setBreak_m05_top2(BreakDto break_m05_top2) {
		this.break_m05_top2 = break_m05_top2;
		this.break_m05_top = break_m05_top2;
	}
	public BreakDto getBreak_m05_bot1() {
		return break_m05_bot1;
	}
	public void setBreak_m05_bot1(BreakDto break_m05_bot1) {
		this.break_m05_bot1 = break_m05_bot1;
		this.break_m05_bot = break_m05_bot1;
	}
	public BreakDto getBreak_m05_bot2() {
		return break_m05_bot2;
	}
	public void setBreak_m05_bot2(BreakDto break_m05_bot2) {
		this.break_m05_bot2 = break_m05_bot2;
		this.break_m05_bot = break_m05_bot2;
	}
	public BreakDto getBreak_m10_top1() {
		return break_m10_top1;
	}
	public void setBreak_m10_top1(BreakDto break_m10_top1) {
		this.break_m10_top1 = break_m10_top1;
		this.break_m10_top = break_m10_top1;
	}
	public BreakDto getBreak_m10_top2() {
		return break_m10_top2;
	}
	public void setBreak_m10_top2(BreakDto break_m10_top2) {
		this.break_m10_top2 = break_m10_top2;
		this.break_m10_top = break_m10_top2;
	}
	public BreakDto getBreak_m10_bot1() {
		return break_m10_bot1;
	}
	public void setBreak_m10_bot1(BreakDto break_m10_bot1) {
		this.break_m10_bot1 = break_m10_bot1;
		this.break_m10_bot = break_m10_bot1;
	}
	public BreakDto getBreak_m10_bot2() {
		return break_m10_bot2;
	}
	public void setBreak_m10_bot2(BreakDto break_m10_bot2) {
		this.break_m10_bot2 = break_m10_bot2;
		this.break_m10_bot = break_m10_bot2;
	}
	public BreakDto getBreak_m01_top() {
		return break_m01_top;
	}
	public void setBreak_m01_top(BreakDto break_m01_top) {
		this.break_m01_top = break_m01_top;
	}
	public BreakDto getBreak_m01_bot() {
		return break_m01_bot;
	}
	public void setBreak_m01_bot(BreakDto break_m01_bot) {
		this.break_m01_bot = break_m01_bot;
	}
	public BreakDto getBreak_m05_bot() {
		return break_m05_bot;
	}
	public BreakDto getBreak_m05_top() {
		return break_m05_top;
	}
	public BreakDto getBreak_m10_bot() {
		return break_m10_bot;
	}
	public BreakDto getBreak_m10_top() {
		return break_m10_top;
	}
	public BreakDto getBreak_m05m10_bot() {
		return break_m05m10_bot;
	}
	public void setBreak_m05m10_bot(BreakDto break_m05m10_bot) {
		this.break_m05m10_bot = break_m05m10_bot;
	}
	public BreakDto getBreak_m05m10_top() {
		return break_m05m10_top;
	}
	public void setBreak_m05m10_top(BreakDto break_m05m10_top) {
		this.break_m05m10_top = break_m05m10_top;
	}
	public BeiliDto getBeili_m05_top() {
		return beili_m05_top;
	}
	public BeiliDto getBeili_m05_bot() {
		return beili_m05_bot;
	}
	public BeiliDto getBeili_m10_top() {
		return beili_m10_top;
	}
	public BeiliDto getBeili_m10_bot() {
		return beili_m10_bot;
	}
	public BeiliDto getBeili_m30_top() {
		return beili_m30_top;
	}
	public BeiliDto getBeili_m30_bot() {
		return beili_m30_bot;
	}
	public CandlesDto getDto_k_01() {
		return this.dto_k_01;
	}
	public void setDto_k_01(CandlesDto dto_k_01) {
		this.dto_k_01 = dto_k_01;
	}

	public int getCnoByPeriod(int period) {
		switch(period){
			case Mark.Period_M05  : return this.cno_k_05;
			case Mark.Period_M10 : return this.cno_k_10;
			case Mark.Period_M30 : return this.cno_k_30;
		}
		return 0;
	}
	
	public void setCnoByPeriod(int period, int cno) {
		switch(period){
			case Mark.Period_M05  : this.cno_k_05 = cno;
				break;
			case Mark.Period_M10 : this.cno_k_10 = cno;
				break;
			case Mark.Period_M30 : this.cno_k_30 = cno;
				break;
		}
	}
}
