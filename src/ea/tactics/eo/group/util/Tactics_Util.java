package ea.tactics.eo.group.util;

import ea.server.Controller;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;

@SuppressWarnings("unused")
public class Tactics_Util {
	private static Tactics_Util singleInstance = null;
	//--- 版本v01
	private int timeRange_v4	= Controller.timeRange_v4 * 60;
	private int m30Range_v4		= Controller.m30Range_v4  *	60;
	private int dvtRange_v4 	= Controller.dvtRange_v4  *	60;
	
	private long t_dvt_30 = 0, t_dvt_10 = 0, t_dvt_05 = 0, t_k_01 = 0;
	private long t_dvt = 0;
	private FenBiInfoDto fxDto = null;
	private boolean bool = false;
	private int ang1, ang2, ang3, kdif1, kdif2, md1;

	public static Tactics_Util getSingleInstance(){
		if (singleInstance == null) {
			synchronized (Tactics_Util.class) {
				if (singleInstance == null) {
					singleInstance = new Tactics_Util();
				}
			}
		}
		return singleInstance;
	}
	/**
	 * V1：只判断背离1的时间范围
	 */
	final public boolean checkDevTimeRange(int version, int dir, int type, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto_k_01){
		if(null == dto_k_01 || dto_k_01.getTime() == Mark.No_Time){
			return false;
		}
		switch(version){
			case Mark.Version_v01 	: return this.checkDvtTime_v1(version, dir, type, dto_dvt_30, dto_dvt_10, dto_dvt_05, dto_k_01);
		}
		return false;
	}
	/**
	 * V1 : 时间范围检验k1,k2
	 */
	final private boolean checkDvtTime_v1(int version, int dir, int type, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto_k_01){
		if(type == Mark.Order_Dir_v03){
			//return this.checkTimeRange(dto_dvt_10.getTime(), dto_dvt_05.getTime(), this.dvtRange_v4);
			return this.checkTimeFxDb(dto_dvt_10.getFxDto(), dto_dvt_05.getFxDto());
		}else{
			this.t_dvt_30 = dto_dvt_30.getTime();
			this.t_k_01 = dto_k_01.getTime();
			switch(type){
				case Mark.Order_Dir_v01 : this.t_dvt = dto_dvt_10.getTime();	this.fxDto = dto_dvt_10.getFxDto();
					break;
				case Mark.Order_Dir_v02 : this.t_dvt = dto_dvt_05.getTime();	this.fxDto = dto_dvt_05.getFxDto();
					break;
			}
			return this.checkTimeFxDb(dto_dvt_30.getFxDto(), this.fxDto);
/*			if(this.checkTimeRange(this.t_dvt_30, this.t_k_01, this.timeRange_v4)){			//M30有效时间
				if(Controller.isAfM30_v4 ? this.t_dvt >= this.t_dvt_30 : true){				//dvt是否在M30后
					if(this.checkTimeRange(this.t_dvt_30, this.t_dvt, this.m30Range_v4)){	//30DVT 和 其他DVT有效时间
						return true;
					}
				}
			}*/
		}
		
		
		//return false;
	}
	/**
	 * 趋势条件，符合返回true
	 */
	final public boolean checkTrend_v1dir36(BeiliDto dto_dvt_10, BeiliDto dto_dvt_05){
		if(!Controller.isUseTrend){
			//return true;
		}
		//--- M05
		this.ang1  = dto_dvt_05.getAng1(); 	this.ang2  = dto_dvt_05.getAng2(); 	this.ang3 = dto_dvt_05.getAng3();
		this.kdif1 = dto_dvt_05.getKdif1();	this.kdif1 = dto_dvt_05.getKdif1(); this.md1  = dto_dvt_05.getMd1();
		//--- 1
		if( ! (this.kdif1 >= 761 || this.kdif2 >=600)){
			return false;
		}
		//--- 2
		if( ! (this.ang1 >= 2487 || this.ang2 >=2434 || this.ang3 >=2000)){
			return false;
		}
		//--- 3
		if( ! (this.md1 >= 33)){
			return false;
		}
		//--- M10
		this.ang1  = dto_dvt_10.getAng1(); 	this.ang2  = dto_dvt_10.getAng2(); 	this.ang3 = dto_dvt_10.getAng3();
		this.kdif1 = dto_dvt_10.getKdif1();	this.kdif1 = dto_dvt_10.getKdif1(); this.md1  = dto_dvt_10.getMd1();
		//--- 1
		if( ! (this.kdif1 >= 300 || this.kdif2 >=735)){
			return false;
		}
		//--- 2
		if( ! (this.ang1 >= 417 || this.ang2 >=1850 || this.ang3 >=679)){
			return false;
		}
		//--- 3
		if( ! (this.md1 >= 28)){
			return false;
		}
		return true;
	}
	
	final private boolean checkTimeFxDb(FenBiInfoDto fxDto_a, FenBiInfoDto fxDto_b){
		//return (fxDto_a.getT2() <= fxDto_b.getT2() && fxDto_b.getT2() <= fxDto_a.getT1()) || (fxDto_a.getT2() <= fxDto_b.getT3() && fxDto_b.getT3() <= fxDto_a.getT1());
		return (fxDto_a.getT2() <= fxDto_b.getT2() && fxDto_b.getT2() <= fxDto_a.getT1());
	}
	final public boolean checkTimeFxSe(FenBiInfoDto fxDto_a, FenBiInfoDto fxDto_b){
		return (fxDto_a.getT2() <= fxDto_b.getT2() && fxDto_b.getT2() <= fxDto_a.getT1()) || (fxDto_a.getT2() <= fxDto_b.getT1() && fxDto_b.getT1() <= fxDto_a.getT1());
	}
	/**
	 * t1 和 t2 的时差是否小于等于mar分钟
	 */
	final private boolean checkTimeRange(long t1, long t2, int mar){
		return Util.difMinutes(t1, t2) <= mar;
	}
}
