package ea.service.res.data.breaks;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import ea.module.breaks.BreakManagerListen;
import ea.server.Data;
import ea.service.res.dto.BreakDto;
import ea.service.res.dto.BreakInMDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.OrderDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;

/**
 * 突破背离入场点，一旦突破就入场
 */
public class BreakInMData {
	
	private static BreakInMData singleInstance = null;
	private HashMap<String, BreakInMDto> map_05 = new HashMap<String, BreakInMDto>();
	private HashMap<String, BreakInMDto> map_10 = new HashMap<String, BreakInMDto>();
	private Iterator<Entry<String, BreakInMDto>> it = null;
	private BreakDto dto_brk = null;
	private FenBiInfoDto fx_Dto = null;
	private double price = Mark.No_Price_Max;
	private int cno, up_cno, dn_cno, period, difMinutes;
	private OrderDto dto = null;
	private int timeRng	 =	130;
	
	final public static BreakInMData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (BreakInMData.class) {
				if (singleInstance == null) {
					singleInstance = new BreakInMData();
				}
			}
		}
		return singleInstance;
	}
	
	final public void checkBreak(int period, CandlesDto dto_k_01){
		switch(period){
			case Mark.Period_M05  : this.it = this.map_05.entrySet().iterator();
				break;
			case Mark.Period_M10 : this.it = this.map_10.entrySet().iterator();
				break;
		}
		
		while(this.it.hasNext()){
			this.checkBreak(dto_k_01, this.it.next().getValue());
		}
	}
	/**
	 * 每分钟运行
	 */
	final private void checkBreak(CandlesDto dto_k_01, BreakInMDto dto){
		if(null == dto_k_01 || !dto.getState()){
			return;
		}
		
		if(dto.getState()){
			this.period = dto.getPeriod();
			if(dto.getDir() == Mark.Action_Type_Buy){
				//--- 1：判断上突
				this.price = dto_k_01.getHigh();
				this.fx_Dto = dto.getUp_fxDto();
				this.difMinutes = this.fx_Dto.getT1()!=0?Util.difMinutes(dto_k_01.getTime(), this.fx_Dto.getT1()):0;
				
				if(this.up_cno != this.fx_Dto.getC2() && this.price > dto.getUp() && this.difMinutes <= this.timeRng){
					this.cno = Data.conditionManager.getCnoByPeriod(this.period);
					//if(Controller.isCheckTrend ? Data.sectionData.checkBreak(Mark.Break_Top, Mark.Period_M5, this.fx_Dto.getC2(), this.cno) : true){	//与前顶比较
						this.up_cno = this.fx_Dto.getC2();
						this.initBreakDto(Mark.Break_Top, this.period, this.cno, dto, this.fx_Dto, dto_k_01);
					//}
				}else if(this.difMinutes > this.timeRng){
					dto.setState(false); // 不再执行
				}
			}else{
				//--- 2：判断下突
				this.price = dto_k_01.getLow();
				this.fx_Dto = dto.getDn_fxDto();
				this.difMinutes = this.fx_Dto.getT1()!=0?Util.difMinutes(dto_k_01.getTime(), this.fx_Dto.getT1()):0;
				
				if(this.dn_cno != this.fx_Dto.getC2() && this.price < dto.getDn() && this.difMinutes <= this.timeRng){
					this.cno = Data.conditionManager.getCnoByPeriod(this.period);
					//if(Controller.isCheckTrend ? Data.sectionData.checkBreak(Mark.Break_Bot, Mark.Period_M5, this.fx_Dto.getC2(), this.cno) : true){	//与前顶比较
						this.dn_cno = this.fx_Dto.getC2();
						this.initBreakDto(Mark.Break_Bot, this.period, this.cno, dto, this.fx_Dto, dto_k_01);
					//}
				}else if(this.difMinutes > this.timeRng){
					dto.setState(false); // 不再执行
				}
			}
		}
	}

	/**
	 * 添加进场时的突破数据
	 */
	final public void add(BreakInMDto dto){
		switch(dto.getPeriod()){
			case Mark.Period_M05  : this.map_05.put(this.getKey(dto.getVersion(), dto.getDir(), dto.getType()), dto);
				break;
			case Mark.Period_M10 : this.map_10.put(this.getKey(dto.getVersion(), dto.getDir(), dto.getType()), dto);
				break;
		}
	}
	
	final public void clear(){
		if(!this.map_05.isEmpty()){
	        this.it =  this.map_05.entrySet().iterator();
	        while(it.hasNext()){
	            if(this.it.next().getValue().getState() == false){
	            	this.it.remove();
	            }
	        } 
		}
		if(!this.map_10.isEmpty()){
	        this.it =  this.map_10.entrySet().iterator();
	        while(it.hasNext()){
	            if(this.it.next().getValue().getState() == false){
	            	this.it.remove();
	            }
	        }
		}
	}
	
	final private String getKey(int version, int dir, int type){
		return new StringBuffer().append(version).append("_").append(dir).append("_").append(type).toString();
	}
	
	final private void initBreakDto(int brk_dir, int period, int cno, BreakInMDto dto, FenBiInfoDto fx_Dto, CandlesDto dto_k_01){
		//-- break data
		this.dto_brk = new BreakDto(period);
		this.dto_brk.setUpdn(brk_dir);
		this.dto_brk.setEcno(fx_Dto.getC2());	// 被突破点
		this.dto_brk.setCno(cno);				// 突破点
		this.dto_brk.setTime(fx_Dto.getT2());
		this.dto_brk.setVal(fx_Dto.getP2());
		this.dto_brk.setDir(Mark.Break_Dir_1);
		this.dto_brk.setBreak(false);			// 需要存储时 true
		this.dto_brk.setBrk_cno(dto_k_01.getCno());
		this.dto_brk.setBreakTime(dto_k_01.getTime());
		this.dto_brk.setFxDto(fx_Dto);
		switch(brk_dir){
			case Mark.Break_Bot : this.dto_brk.setBreakVal(dto_k_01.getLow());		  
				break;
			case Mark.Break_Top : this.dto_brk.setBreakVal(dto_k_01.getHigh());
				break;
		}
		BreakManagerListen.getSingleInstance().listenBreak(this.dto_brk);
		//-- in market
		this.dto = new OrderDto(dto.getVersion());
		this.dto.setEcno(Data.conditionManager.getFmDtoByPeriod(Mark.Period_M30).getF_dto().getC1());
		this.dto.setDir(dto.getDir());
		this.dto.setType(dto.getType());
		this.dto.setIcno(dto_k_01.getCno());
		this.dto.setIn_time(dto_k_01.getTime());
		this.dto.setIn_price(dto_k_01.getClose());
		this.dto.setIn_dvt05(dto.getIn_dvt05());
		this.dto.setIn_dvt10(dto.getIn_dvt10());
		this.dto.setIn_dvt30(dto.getIn_dvt30());
		this.dto.setIn_brk05_dvt(dto.getIn_brk05());
		this.dto.setIn_brk10_dvt(dto.getIn_brk10());
		Data.inOrderManager.inMarket(this.dto);
		dto.setState(false); // 不再执行
	}
}
