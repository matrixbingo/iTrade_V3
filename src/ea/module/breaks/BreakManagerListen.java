package ea.module.breaks;

import java.util.ArrayList;

import ea.server.Data;
import ea.service.res.dto.BreakDto;
import ea.service.res.dto.InListDto;
import ea.service.utils.base.Mark;

public class BreakManagerListen{
	private static BreakManagerListen singleInstance = null;
	private ArrayList<InListDto> ilist_up_05 = new ArrayList<InListDto>(), ilist_dn_05 = new ArrayList<InListDto>(), ilist_up_10 = new ArrayList<InListDto>(), ilist_dn_10 = new ArrayList<InListDto>();
	private ArrayList<Integer> list = null;
	
	public static BreakManagerListen getSingleInstance(){
		if (singleInstance == null) {
			synchronized (BreakManagerListen.class) {
				if (singleInstance == null) {
					singleInstance = new BreakManagerListen();
				}
			}
		}
		return singleInstance;
	}
	final public void listenBreak(BreakDto dto){
		switch(dto.getPeriod()){
			case Mark.Period_M01  : this.m1BreakServer(dto);
				break;
			case Mark.Period_M05  : this.m5m10BreakServer(dto);
				break;
			case Mark.Period_M10 : this.m5m10BreakServer(dto);
				break;
		}
	}	
	private BreakManagerListen(){
		//-- break 05 in market
		this.ilist_dn_05.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v05, Mark.Order_Dir_v06)));  // 空
		this.ilist_up_05.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v05, Mark.Order_Dir_v06)));	 // 多
		
		//-- break 10 in market
		this.ilist_dn_10.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v04)));	
		this.ilist_up_10.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v04)));
	}
	
	final public void m1BreakServer(BreakDto dto) {
		if(dto.isBreak()){
			Data.conditionManager.addBreakRemark(dto);
		}
	}

	final public void m5m10BreakServer(BreakDto dto) {
		Data.conditionManager.addBreakRemark(dto);
		
		if(dto.getPeriod() == Mark.Period_M05){
			//Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Break_Top ? this.ilist_up_05 : this.ilist_dn_05);			//运行策略组
		}else{
			//Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Break_Top ? this.ilist_up_10 : this.ilist_dn_10);			//运行策略组
		}
	}
	
	final public void inMarketlistenBreak(BreakDto dto){
	
	}
	
	final private ArrayList<Integer> addlist(int ...ints){
		this.list = new ArrayList<Integer>();
		for(int i : ints){
			this.list.add(i);
		}
		return this.list;
    }
}
