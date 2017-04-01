package ea.module.breaks;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.BreakDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.utils.base.Mark;

/**
 * 判断是否突破
 * @author WL
 * @date 2012-9-27 上午9:58:22
 */
public class BreakManager {
	private static BreakManager singleInstance = null; //唯一实例
	private BreakManagerListen breaklisten = null;
	private BreakDto dto_brk = null;
	private FenBiInfoDto fx_Dto = null;
	private double price = Mark.No_Price_Max;
	private int cno = 0, up_cno_05 = 0, up_cno_10 = 0, up_cno_30 = 0, dn_cno_05 = 0, dn_cno_10 = 0, dn_cno_30 = 0;
	
	public static BreakManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (BreakManager.class) {
				if (singleInstance == null) {
					singleInstance = new BreakManager();
				}
			}
		}
		return singleInstance;
	}
	private BreakManager(){
		breaklisten = BreakManagerListen.getSingleInstance();
	}
	/**
	 * 每分钟运行、与背离重合: M05
	 */
	final public void checkBreak_05(CandlesDto dto_k_01){
		if(null == dto_k_01){
			return;
		}
		//--- 1：判断上突
		this.fx_Dto = Data.breakDvtData.getUp_fxDto_05();
		if(null == this.fx_Dto){
			return;
		}
		this.price = dto_k_01.getHigh();
		if(this.up_cno_05 != this.fx_Dto.getC2() && this.price > Data.breakDvtData.getUp_05()){
			this.cno = Data.conditionManager.getCnoByPeriod(Mark.Period_M05);
			if(Controller.isCheckTrend ? Data.sectionData.checkBreak(Mark.Break_Top, Mark.Period_M05, this.fx_Dto.getC2(), this.cno) : true){	//与前顶比较
				this.up_cno_05 = this.fx_Dto.getC2();
				this.initBreakDto(Mark.Break_Top, Mark.Period_M05, this.cno, this.fx_Dto, dto_k_01);
			}
		}
		
		//--- 2：判断下突
		this.price = dto_k_01.getLow();
		this.fx_Dto = Data.breakDvtData.getDn_fxDto_05();
		if(null == this.fx_Dto){
			return;
		}
		if(this.dn_cno_05 != this.fx_Dto.getC2() && this.price < Data.breakDvtData.getDn_05()){
			this.cno = Data.conditionManager.getCnoByPeriod(Mark.Period_M05);
			if(Controller.isCheckTrend ? Data.sectionData.checkBreak(Mark.Break_Bot, Mark.Period_M05, this.fx_Dto.getC2(), this.cno) : true){	//与前顶比较
				this.dn_cno_05 = this.fx_Dto.getC2();
				this.initBreakDto(Mark.Break_Bot, Mark.Period_M05, this.cno, this.fx_Dto, dto_k_01);
			}
		}
	}
	/**
	 * 每分钟运行、与背离重合: M10
	 */
	final public void checkBreak_10(CandlesDto dto_k_01){
		if(null == dto_k_01){
			return;
		}
		//--- 1：判断上突
		this.price = dto_k_01.getHigh();
		this.fx_Dto = Data.breakDvtData.getUp_fxDto_10();
		if(null == this.fx_Dto){
			return;
		}
		if(this.up_cno_10 != this.fx_Dto.getC2() && this.price > Data.breakDvtData.getUp_10()){
			this.cno = Data.conditionManager.getCnoByPeriod(Mark.Period_M10);
			if(Controller.isCheckTrend ? Data.sectionData.checkBreak(Mark.Break_Top, Mark.Period_M10, this.fx_Dto.getC2(), this.cno) : true){	//与前顶比较
				this.up_cno_10 = this.fx_Dto.getC2();
				this.initBreakDto(Mark.Break_Top, Mark.Period_M10, this.cno, this.fx_Dto, dto_k_01);
			}
		}
		
		//--- 2：判断下突
		this.price = dto_k_01.getLow();
		this.fx_Dto = Data.breakDvtData.getDn_fxDto_10();
		if(null == this.fx_Dto){
			return;
		}
		if(this.dn_cno_10 != this.fx_Dto.getC2() && this.price < Data.breakDvtData.getDn_10()){
			this.cno = Data.conditionManager.getCnoByPeriod(Mark.Period_M10);
			if(Controller.isCheckTrend ? Data.sectionData.checkBreak(Mark.Break_Bot, Mark.Period_M10, this.fx_Dto.getC2(), this.cno) : true){	//与前顶比较
				this.dn_cno_10 = this.fx_Dto.getC2();
				this.initBreakDto(Mark.Break_Bot, Mark.Period_M10, this.cno, this.fx_Dto, dto_k_01);
			}
		}
	}
	/**
	 * 每分钟运行、根据Fx: M30
	 */
	final public BreakDto checkBreak_30(CandlesDto dto_k_01, FenBiInfoDto f_dto){
		if(null == dto_k_01 || null == f_dto){
			return null;
		}
		//System.out.println("checkBreak_30 ---> " + f_dto.getPeriod() + " : " + f_dto.getT1());
		if(f_dto.getDir() == Mark.From_Top){	//System.out.println("Mark.From_Top ---> " + f_dto.getDir());
			//--- 1：判断上突
			this.price = dto_k_01.getHigh();
			//if(this.up_cno_30 != f_dto.getC2() || this.price > f_dto.getP3()){
			if(this.price > f_dto.getP3()){	//System.out.println("this.price " + this.price + " : " + f_dto.getP3());
				this.cno = Data.conditionManager.getCnoByPeriod(Mark.Period_M30);
				this.up_cno_30 = f_dto.getC2();
				return this.initBreakDto(Mark.Break_Top, Mark.Period_M30, this.cno, f_dto, dto_k_01);
			}
		}
		
		if(f_dto.getDir() == Mark.From_Btm){	//System.out.println("Mark.From_Btm ---> " + f_dto.getDir());
			//--- 1：判断下突
			this.price = dto_k_01.getLow();
			//if(this.dn_cno_30 != f_dto.getC2() && this.price < f_dto.getP3()){
			if(this.price < f_dto.getP3()){		//System.out.println("this.price" + this.price + " : " + f_dto.getP3());
				this.cno = Data.conditionManager.getCnoByPeriod(Mark.Period_M30);
				this.dn_cno_30 = f_dto.getC2();
				return this.initBreakDto(Mark.From_Btm, Mark.Period_M30, this.cno, f_dto, dto_k_01);
			}
		}
		
		return null;
	}
	
	final private BreakDto initBreakDto(int type, int period, int cno, FenBiInfoDto fx_Dto, CandlesDto dto_k_01){
		this.dto_brk = new BreakDto(period);
		this.dto_brk.setUpdn(type);
		this.dto_brk.setEcno(fx_Dto.getC2());	// 被突破点
		this.dto_brk.setCno(cno);				// 突破点
		this.dto_brk.setTime(fx_Dto.getT2());
		this.dto_brk.setVal(fx_Dto.getP2());
		this.dto_brk.setDir(Mark.Break_Dir_1);
		this.dto_brk.setBreak(true);
		this.dto_brk.setBrk_cno(dto_k_01.getCno());
		this.dto_brk.setBreakTime(dto_k_01.getTime());
		this.dto_brk.setFxDto(fx_Dto);
		switch(type){
			case Mark.Break_Bot : this.dto_brk.setBreakVal(dto_k_01.getLow());		  
				break;
			case Mark.Break_Top : this.dto_brk.setBreakVal(dto_k_01.getHigh());
				break;
		}
		this.breaklisten.listenBreak(this.dto_brk);
		
		return this.dto_brk;
	}
}