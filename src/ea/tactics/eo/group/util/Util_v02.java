package ea.tactics.eo.group.util;

import java.util.ArrayList;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;

@SuppressWarnings("unused")
public class Util_v02 {
	private CandlesDto dto_k_01	= null;
	private FxMacdDto fm_dto = null;
	private BeiliDto dto_dvt_05 = null, dto_dvt_10 = null;
	private int ang1, ang2, ang3, kdif1, kdif2, md1,i1,i2,i3;
	private ArrayList<Integer>	cnoes = null;
	/**
	 * V2:D1
	 */
	final public void buy(BeiliDto dto_dvt_30){
		this.exeOne(Mark.Action_Type_Buy, dto_dvt_30);
	}
	/**
	 * V2:K1
	 */
	final public void sell(BeiliDto dto_dvt_30){
		this.exeOne(Mark.Action_Type_Sell, dto_dvt_30);
	}
	
	final private void exeOne(int dir, BeiliDto dto_dvt_30){
		this.dto_k_01 = Data.conditionManager.getDto_k_01();
		this.fm_dto = Data.fxManager.getFxMacdDto(Mark.Period_M10, dto_dvt_30.getFxDto());
		this.dto_dvt_10 = Data.beiLiManager_Me.getBeiliDtoByPeriod(Mark.Period_M10, this.dto_k_01.getTime(), this.dto_k_01, this.fm_dto);
		if(null!= this.fm_dto && null != this.dto_dvt_10 && this.dto_dvt_10.isBeili() && this.checkDevM30(dto_dvt_30)){
			Data.inOrderManager.inMarketByType(Mark.Version_v02, dir, Mark.Order_Dir_v01, dto_dvt_30, this.dto_dvt_10, null, this.dto_k_01);
		}
	}
	
	//--Dvt30过滤条件
		final private boolean checkDevM30(BeiliDto dto_dvt_30){
			//--- M30
			this.ang1  = dto_dvt_30.getAng1(); 	this.ang2  = dto_dvt_30.getAng2(); 	this.ang3 = dto_dvt_30.getAng3();
			this.kdif1 = dto_dvt_30.getKdif1();	this.kdif1 = dto_dvt_30.getKdif1(); this.md1  = dto_dvt_30.getMd1();
			this.cnoes = dto_dvt_30.getCnoes();
			this.i1 = this.cnoes.get(0) - this.cnoes.get(1);
			this.i2 = this.cnoes.get(1) - this.cnoes.get(2);
			this.i3 = this.cnoes.get(2) - this.cnoes.get(3);
			
			if(this.i1 <= 23 && this.i2 <= 13 && this.i3 <= 15 && this.ang1 <= 942 && this.ang2 <=1564 && this.ang3 <=1755){
				return false;
			}
			if(this.i1 <= 9 && this.i2 <= 10 && this.i3 <= 43 && this.ang1 <= 2925 && this.ang2 <=2466 && this.ang3 <=519){
				return false;
			}
			if(this.i1 <= 10 && this.i2 <= 10 && this.i3 <= 28 && this.ang1 <= 2266 && this.ang2 <=2166 && this.ang3 <=607){
				return false;
			}
			if(this.i1 <= 35 && this.i2 <= 7 && this.i3 <= 17 && this.ang1 <= 541 && this.ang2 <=3571 && this.ang3 <=1333){
				return false;
			}
			if(this.i1 <= 29 && this.i2 <= 5 && this.i3 <= 15 && this.ang1 <= 862 && this.ang2 <=5600 && this.ang3 <=1888){
				return false;
			}
			if(this.i1 <= 28 && this.i2 <= 4 && this.i3 <= 9 && this.ang1 <= 547 && this.ang2 <=6416 && this.ang3 <=2851){
				return false;
			}
			if(this.i1 <= 28 && this.i2 <= 4 && this.i3 <= 9 && this.ang1 <= 547 && this.ang2 <=6416 && this.ang3 <=2851){
				return false;
			}
			if(this.i1 <= 18 && this.i2 <= 17 && this.i3 <= 14 && this.ang1 <= 1203 && this.ang2 <=921 && this.ang3 <=1761){
				return false;
			}
			if(this.i1 <= 11 && this.i2 <= 6 && this.i3 <= 32 && this.ang1 <= 2393 && this.ang2 <=3777 && this.ang3 <=437){
				return false;
			}
			if(this.i1 <= 11 && this.i2 <= 6 && this.i3 <= 32 && this.ang1 <= 2393 && this.ang2 <=3777 && this.ang3 <=437){
				return false;
			}
			if(this.i1 <= 12 && this.i2 <= 5 && this.i3 <= 28 && this.ang1 <= 1861 && this.ang2 <=5133 && this.ang3 <=559){
				return false;
			}
			if(this.i1 <= 16 && this.i2 <= 9 && this.i3 <= 34 && this.ang1 <= 1458 && this.ang2 <=2407 && this.ang3 <=686){
				return false;
			}
			if(this.i1 <= 34 && this.i2 <= 18 && this.i3 <= 43 && this.ang1 <= 529 && this.ang2 <=1185 && this.ang3 <=441){
				return false;
			}
			if(this.i1 <= 18 && this.i2 <= 21 && this.i3 <= 15 && this.ang1 <= 1296 && this.ang2 <=587 && this.ang3 <=1555){
				return false;
			}
			if(this.i1 <= 17 && this.i2 <= 30 && this.i3 <= 8 && this.ang1 <= 1333 && this.ang2 <=522 && this.ang3 <=3333){
				return false;
			}
			return true;
		}
}