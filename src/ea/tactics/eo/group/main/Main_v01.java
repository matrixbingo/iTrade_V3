package ea.tactics.eo.group.main;

import java.util.ArrayList;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakDto;
import ea.service.utils.base.Mark;
import ea.tactics.eo.group.util.Util_v01;

@SuppressWarnings("unused")
public class Main_v01 {
	private static Main_v01 singleInstance = null;
	private Util_v01 util = null;
	private BreakDto dto = null;
	private int dn_K30_flag = 0, up_K30_flag = 0, dn_K10_flag = 0, up_K10_flag = 0;
	private BeiliDto dto_dvt_05 = null, dto_dvt_10 = null, dto_dvt_30 = null;
	
	final public static Main_v01 getSingleInstance(){
		if (singleInstance == null) {
			synchronized (Main_v01.class) {
				if (singleInstance == null) {
					singleInstance = new Main_v01();
				}
			}
		}
		return singleInstance;
	}
	
	private Main_v01(){
		this.util = new Util_v01();
	}
	
	/**
	 * v1 buy
	 */
	final public void buyTacticsOne(ArrayList<Integer> list){
		this.dto_dvt_30 = Data.conditionManager.getBeili_m30_bot1();
		this.dto_dvt_10 = Data.conditionManager.getBeili_m10_bot1();
		this.dto_dvt_05 = Data.conditionManager.getBeili_m05_bot1();
		//-- Up1,2
		if(list.contains(Mark.Order_Dir_v01) || list.contains(Mark.Order_Dir_v02)) {
			if(null != this.dto_dvt_30 && this.dto_dvt_30.getUpdn() == Mark.Beili_Bot) {
				if(this.dto_dvt_30.getDir() == Mark.Beili_Dir_1 && (this.up_K30_flag == 0 || this.up_K30_flag != this.dto_dvt_30.getCno())){
					
					this.up_K30_flag = this.dto_dvt_30.getCno();
					
					this.util.isTimeRange(list, Mark.Action_Type_Buy, this.dto_dvt_30, this.dto_dvt_10, this.dto_dvt_05, Data.conditionManager.getDto_k_01());
				}
			}
		}
		
		//-- Up4
		if(list.contains(Mark.Order_Dir_v04)){
			this.dto = Data.conditionManager.getBreak_m10_top1();
			Data.inBrkMarketData.checkIn(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v04, this.dto);
		}
		//-- Up5
		if(list.contains(Mark.Order_Dir_v05)){
			this.dto = Data.conditionManager.getBreak_m05_top1();
			Data.inBrkMarketData.checkIn(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v05, this.dto);
		}
		
		//-- Up3, Up6
		if(list.contains(Mark.Order_Dir_v03) || list.contains(Mark.Order_Dir_v06)) {
			if(null != this.dto_dvt_10 && null != this.dto_dvt_05 ){//&& this.up_K10_flag != this.dto_dvt_10.getCno()){
				//this.up_K10_flag = this.dto_dvt_10.getCno();
				this.util.iMarket_k3d3(list, Mark.Action_Type_Buy, this.dto_dvt_10, this.dto_dvt_05, Data.conditionManager.getDto_k_01());
			}
		}
	}
	
	/**
	 * v1 sell
	 */
	final public void sellTacticsOne(ArrayList<Integer> list){
		this.dto_dvt_30 = Data.conditionManager.getBeili_m30_top1();
		this.dto_dvt_10 = Data.conditionManager.getBeili_m10_top1();
		this.dto_dvt_05 = Data.conditionManager.getBeili_m05_top1();
		//-- Dn1,2
		if(list.contains(Mark.Order_Dir_v01) || list.contains(Mark.Order_Dir_v02) || list.contains(Mark.Order_Dir_v04) || list.contains(Mark.Order_Dir_v05)) {
			if(null != this.dto_dvt_30 && this.dto_dvt_30.getUpdn() == Mark.Beili_Top){
				if(this.dto_dvt_30.getDir() == Mark.Beili_Dir_1 && (this.dn_K30_flag == 0 || this.dn_K30_flag != this.dto_dvt_30.getCno())){
			
					this.dn_K30_flag = this.dto_dvt_30.getCno();
					
					this.util.isTimeRange(list, Mark.Action_Type_Sell, this.dto_dvt_30, this.dto_dvt_10, this.dto_dvt_05, Data.conditionManager.getDto_k_01());
				}
			}
		}
		//-- Dn4
		if(list.contains(Mark.Order_Dir_v04)){
			this.dto = Data.conditionManager.getBreak_m10_bot1();
			Data.inBrkMarketData.checkIn(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v04, this.dto);
		}
		//-- Dn5
		if(list.contains(Mark.Order_Dir_v05)){
			this.dto = Data.conditionManager.getBreak_m05_bot1();
			Data.inBrkMarketData.checkIn(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v05, this.dto);
		}
		
		//-- Dn3, Dn6
		if(list.contains(Mark.Order_Dir_v03) || list.contains(Mark.Order_Dir_v06)) {
			if(null != this.dto_dvt_10 && null != this.dto_dvt_05){// && this.dn_K10_flag != this.dto_dvt_10.getCno()){
				//this.dn_K10_flag = this.dto_dvt_10.getCno();
				this.util.iMarket_k3d3(list, Mark.Action_Type_Sell, this.dto_dvt_10, this.dto_dvt_05, Data.conditionManager.getDto_k_01());
			}
		}
	}
}
