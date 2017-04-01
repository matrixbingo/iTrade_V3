package ea.tactics.eo.group.util;

import java.util.ArrayList;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakInMDto;
import ea.service.res.dto.CandlesDto;
import ea.service.utils.base.Mark;

@SuppressWarnings("unused")
public class Util_v01 {
	private BreakInMDto brk_dto = null;
	private int ang1, ang2, ang3, kdif1, kdif2, md1,i1,i2,i3;
	private ArrayList<Integer>	cnoes = null;
	/**
	 * d and k both use
	 */
	final public void isTimeRange(ArrayList<Integer> list, int dir, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto){

		if(dto.getTime() == Mark.No_Time){
			return;
		}
		
		switch(dir){
			case Mark.Action_Type_Buy	: this.buy (list, dto_dvt_30, dto_dvt_10, dto_dvt_05, dto);
				break;
			case Mark.Action_Type_Sell	: this.sell(list, dto_dvt_30, dto_dvt_10, dto_dvt_05, dto);
				break;
		}
	}
	
	/**
	 * Up4:D1 & D2
	 */
	final private void buy(ArrayList<Integer> list, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto_k_01){
		//--- D1
		if(Data.conditionTactis.isBeili_10_dn() == true && dto_dvt_10.getDir() == Mark.Beili_Dir_1){
			if(Data.tactics_Util.checkDevTimeRange(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v01, dto_dvt_30, dto_dvt_10, null, dto_k_01)){
				if(list.contains(Mark.Order_Dir_v01)){
					Data.inOrderManager.inMarketByType(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v01, dto_dvt_30, dto_dvt_10, null, dto_k_01);
				}
				//Data.inBrkMarketData.addInMarketDto(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v04, dto_dvt_30, dto_dvt_10, null);
			}
		}
		//--- D2
		if(Data.conditionTactis.isBeili_05_dn() == true && dto_dvt_05.getDir() == Mark.Beili_Dir_1){
			if(Data.tactics_Util.checkDevTimeRange(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v02, dto_dvt_30, null, dto_dvt_05, dto_k_01)){
				if(list.contains(Mark.Order_Dir_v02)){
					Data.inOrderManager.inMarketByType(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v02, dto_dvt_30, null, dto_dvt_05, dto_k_01);
				}
				//Data.inBrkMarketData.addInMarketDto(Mark.Version_v01, Mark.Action_Type_Buy, Mark.Order_Dir_v05, dto_dvt_30, null, dto_dvt_05);
			}
		}
	}
	
	/**
	 * Dn4:K1 & K2
	 */
	final private void sell(ArrayList<Integer> list, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto_k_01){
		//--- k1
		if(Data.conditionTactis.isBeili_10_up() == true && dto_dvt_10.getDir() == Mark.Beili_Dir_1){
			if(Data.tactics_Util.checkDevTimeRange(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v01, dto_dvt_30, dto_dvt_10, null, dto_k_01)){	
				if(list.contains(Mark.Order_Dir_v01)){
					Data.inOrderManager.inMarketByType(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v01, dto_dvt_30, dto_dvt_10, null, dto_k_01);
				}
				//Data.inBrkMarketData.addInMarketDto(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v04, dto_dvt_30, dto_dvt_10, null);// 此处仅为添加需要的条件待突破时调用
			}
		}
		//--- k2
		if(Data.conditionTactis.isBeili_05_up() == true && dto_dvt_05.getDir() == Mark.Beili_Dir_1){
			if(Data.tactics_Util.checkDevTimeRange(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v02, dto_dvt_30, null, dto_dvt_05, dto_k_01)){
				if(list.contains(Mark.Order_Dir_v02)){
					Data.inOrderManager.inMarketByType(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v02, dto_dvt_30, null, dto_dvt_05, dto_k_01);
				}
				//Data.inBrkMarketData.addInMarketDto(Mark.Version_v01, Mark.Action_Type_Sell, Mark.Order_Dir_v05, dto_dvt_30, null, dto_dvt_05);
			}
		}
	}
	
	/**
	 * K3,K6 and D3,D6
	 */
	final public void iMarket_k3d3(ArrayList<Integer> list, int dir, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto_k_01){
		if(Data.tactics_Util.checkDevTimeRange(Mark.Version_v01, dir, Mark.Order_Dir_v03, null, dto_dvt_10, dto_dvt_05, dto_k_01)){
			if(list.contains(Mark.Order_Dir_v03) && Data.tactics_Util.checkTrend_v1dir36(dto_dvt_10, dto_dvt_05) && this.checkDevM10(dto_dvt_10)){
				Data.inOrderManager.inMarketByType(Mark.Version_v01, dir, Mark.Order_Dir_v03, null, dto_dvt_10, dto_dvt_05, dto_k_01);
			}
			if(list.contains(Mark.Order_Dir_v06)){
				this.initBreakInMDto(Mark.Version_v01, dir, Mark.Order_Dir_v06, Mark.Period_M05, dto_dvt_05, dto_dvt_10);
			}
		}
	}
	
	final private void initBreakInMDto(int version, int dir, int type, int period, BeiliDto dto_dvt_05, BeiliDto dto_dvt_10){
		this.brk_dto = new BreakInMDto(version, dir, type, period);
		this.brk_dto.setIn_dvt05(dto_dvt_05.getCno());
		this.brk_dto.setIn_dvt10(dto_dvt_10.getCno());
		if(dir == Mark.Action_Type_Buy){
			this.brk_dto.setUp(dto_dvt_05.getFxDto().getP2());
			this.brk_dto.setUp_fxDto(dto_dvt_05.getFxDto());
		}else{
			this.brk_dto.setDn(dto_dvt_05.getFxDto().getP2());
			this.brk_dto.setDn_fxDto(dto_dvt_05.getFxDto());
		}
		Data.breakInMData.add(this.brk_dto);
	}
	
	//--Dvt10过滤条件
		final private boolean checkDevM10(BeiliDto dto_dvt_10){
			//--- M10
			this.ang1  = dto_dvt_10.getAng1(); 	this.ang2  = dto_dvt_10.getAng2(); 	this.ang3 = dto_dvt_10.getAng3();
			this.kdif1 = dto_dvt_10.getKdif1();	this.kdif1 = dto_dvt_10.getKdif1(); this.md1  = dto_dvt_10.getMd1();
			this.cnoes = dto_dvt_10.getCnoes();
			this.i1 = this.cnoes.get(0) - this.cnoes.get(1);
			this.i2 = this.cnoes.get(1) - this.cnoes.get(2);
			this.i3 = this.cnoes.get(2) - this.cnoes.get(3);

			if(this.i1 <= 10 && this.i2 <= 6 && this.i3 <= 34 && this.ang1 <= 7000 && this.ang2 <= 12666 && this.ang3 <= 1878){
				return false;
			}

			return true;
		}
}