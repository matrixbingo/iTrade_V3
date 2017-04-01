package ea.tactics.eo.group.util;

import java.util.ArrayList;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;

@SuppressWarnings("unused")
public class Util_v03 {
	private CandlesDto dto_k_01	= null;
	private FxMacdDto fm_dto = null;
	private BeiliDto dto_dvt_05 = null, dto_dvt_10 = null;
	private int ang1, ang2, ang3, kdif1, kdif2, md1,i1,i2,i3;
	private ArrayList<Integer>	cnoes = null;
	
	/**
	 * V3 : D1 D3 K1 K3
	 */
	final public void exeOne(int dir, int type, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05){
		this.dto_k_01 = Data.conditionManager.getDto_k_01();
		if(type == Mark.Order_Dir_v01 && this.checkTimeFx(dto_dvt_30, dto_dvt_10, 10) && this.checkDevM30(dto_dvt_30)){
			Data.inOrderManager.inMarketByType(Mark.Version_v03, dir, type, dto_dvt_30, dto_dvt_10, null, this.dto_k_01);
			//System.out.println(dto_dvt_30.getCno() + "<-------->" + dto_dvt_10.getCno());
		}
		if(type == Mark.Order_Dir_v02 && this.checkTimeFx(dto_dvt_30, dto_dvt_10, dto_dvt_05) && this.checkDevM30(dto_dvt_30) && this.checkDevM10(dto_dvt_10)){
			Data.inOrderManager.inMarketByType(Mark.Version_v03, dir, type, dto_dvt_30, dto_dvt_10, dto_dvt_05, this.dto_k_01);
		}
		if(type == Mark.Order_Dir_v03 && this.checkTimeFx(dto_dvt_10, dto_dvt_05, 5) && this.checkDevM10(dto_dvt_10)){
			Data.inOrderManager.inMarketByType(Mark.Version_v03, dir, type, null, dto_dvt_10, dto_dvt_05, this.dto_k_01);
			//System.out.println(dto_dvt_10.getCno() + "<-------->" + dto_dvt_05.getCno());
		}
	}
	
	final private boolean checkTimeFx(BeiliDto a, BeiliDto b, int dtime){
		//return Util.difMinutes(a.getFxDto().getT1(), b.getFxDto().getT1()) <= dtime;
		return a.getFxDto().getT1() == b.getFxDto().getT1();
	}
	
	final private boolean checkTimeFx(BeiliDto a, BeiliDto b, BeiliDto c){
		return a.getFxDto().getT1() == b.getFxDto().getT1() &&  a.getFxDto().getT1() == c.getFxDto().getT1();
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
		
		if(this.i1 <= 5 && this.i2 <= 5 && this.i3 <= 22 && this.ang1 <= 5533 && this.ang2 <=5266 && this.ang3 <=1045){
			return false;
		}
		if(this.i1 <= 23 && this.i2 <= 6 && this.i3 <= 24 && this.ang1 <= 1948 && this.ang2 <=4611 && this.ang3 <=958){
			return false;
		}
		if(this.i1 <= 8 && this.i2 <= 6 && this.i3 == 1 && this.ang1 <= 2833 && this.ang2 <=3388 && this.ang3 <=28666){
			return false;
		}
		if(this.i1 <= 7 && this.i2 == 1 && this.i3 <= 7 && this.ang1 <= 3666 && this.ang2 <=28666 && this.ang3 <=3952){
			return false;
		}
		if(this.i1 <= 3 && this.i2 <= 5 && this.i3 <= 22 && this.ang1 <= 9444 && this.ang2 <=5266 && this.ang3 <=1045){
			return false;
		}
		if(this.i1 <= 4 && this.i2 <= 5 && this.i3 <= 22 && this.ang1 <= 6916 && this.ang2 <=5266 && this.ang3 <=1045){
			return false;
		}
		if(this.i1 <= 5 && this.i2 <= 5 && this.i3 <= 4 && this.ang1 <= 5533 && this.ang2 <= 5266 && this.ang3 <=1045){
			return false;
		}
		if(this.i1 <= 3 && this.i2 <= 3 && this.i3 <= 14 && this.ang1 <= 8444 && this.ang2 <= 7777 && this.ang3 <=1761){
			return false;
		}
		if(this.i1 <= 5 && this.i2 <= 2 && this.i3 <= 2 && this.ang1 <= 3533 && this.ang2 <= 12000 && this.ang3 <=2000){
			return false;
		}
		if(this.i1 <= 3 && this.i2 <= 2 && this.i3 <= 2 && this.ang1 <= 9000 && this.ang2 <= 13833 && this.ang3 <=14166){
			return false;
		}
		if(this.i1 <= 3 && this.i2 <= 3 && this.i3 <= 4 && this.ang1 <= 8555 && this.ang2 <= 8333 && this.ang3 <=1466){
			return false;
		}
		if(this.i1 <= 2 && this.i2 <= 2 && this.i3 <= 15 && this.ang1 <= 10166 && this.ang2 <= 9333 && this.ang3 <=1111){
			return false;
		}
		if(this.i1 <= 3 && this.i2 == 1 && this.i3 <= 3 && this.ang1 <= 8444 && this.ang2 <= 27666 && this.ang3 <=8555){
			return false;
		}
		if(this.i1 <= 11 && this.i2 <= 10 && this.i3 <= 43 && this.ang1 <= 3363 && this.ang2 <= 2466 && this.ang3 <=519){
			return false;
		}
		return true;
	}
	//--Dvt10过滤条件
	final private boolean checkDevM10(BeiliDto dto_dvt_10){
		//--- M30
		this.ang1  = dto_dvt_10.getAng1(); 	this.ang2  = dto_dvt_10.getAng2(); 	this.ang3 = dto_dvt_10.getAng3();
		this.kdif1 = dto_dvt_10.getKdif1();	this.kdif1 = dto_dvt_10.getKdif1(); this.md1  = dto_dvt_10.getMd1();
		this.cnoes = dto_dvt_10.getCnoes();
		this.i1 = this.cnoes.get(0) - this.cnoes.get(1);
		this.i2 = this.cnoes.get(1) - this.cnoes.get(2);
		this.i3 = this.cnoes.get(2) - this.cnoes.get(3);

		if(this.i1 <= 21 && this.i2 <= 6 && this.i3 <= 9 && this.ang1 <= 2761 && this.ang2 <= 13000 && this.ang3 <= 8555){
			return false;
		}
		if(this.i1 <= 15 && this.i2 <= 7 && this.i3 <= 4 && this.ang1 <= 3533 && this.ang2 <= 10000 && this.ang3 <= 21250){
			return false;
		}
		if(this.i1 <= 15 && this.i2 <= 7 && this.i3 <= 4 && this.ang1 <= 3533 && this.ang2 <= 10000 && this.ang3 <= 21250){
			return false;
		}
		if(this.i1 <= 27 && this.i2 <= 5 && this.i3 <= 14 && this.ang1 <= 2481 && this.ang2 <= 17000 && this.ang3 <= 5428){
			return false;
		}
/*		if(this.i1 <= 2 && this.i2 <= 6 && this.i3 <= 31 && this.ang1 <= 45000 && this.ang2 <= 14333 && this.ang3 <= 2741){
			return false;
		}*/
	/*	if(this.i1 <= 9 && this.i2 <= 4 && this.i3 <= 38 && this.ang1 <= 9444 && this.ang2 <= 21500 && this.ang3 <= 2750){
			return false;
		}*/
		if(this.i1 <= 25 && this.i2 <= 9 && this.i3 <= 10 && this.ang1 <= 2760 && this.ang2 <= 8888 && this.ang3 <= 8400){
			return false;
		}
		if(this.i1 <= 16 && this.i2 <= 10 && this.i3 <= 6 && this.ang1 <= 2937 && this.ang2 <= 5400 && this.ang3 <= 4714){
			return false;
		}
/*		if(this.i1 <= 4 && this.i2 <= 6 && this.i3 <= 22 && this.ang1 <= 19250 && this.ang2 <= 11833 && this.ang3 <= 2954){
			return false;
		}
		if(this.i1 <= 16 && this.i2 <= 21 && this.i3 <= 7 && this.ang1 <= 4562 && this.ang2 <= 2952 && this.ang3 <= 11714){
			return false;
		}*/
		return true;
	}
}