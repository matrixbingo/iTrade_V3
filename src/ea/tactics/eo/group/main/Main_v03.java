package ea.tactics.eo.group.main;

import java.util.ArrayList;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.utils.base.Mark;
import ea.tactics.eo.group.util.Util_v03;

public class Main_v03 {
	private static Main_v03 singleInstance = null;
	private Util_v03 util = null;
	private int dn_K30_flag = 0, up_K30_flag = 0, dn_K10_flag = 0, up_K10_flag = 0, up_K30_flag_1 = 0, dn_K30_flag_1 = 0;
	private BeiliDto dto_dvt_05 = null, dto_dvt_10 = null, dto_dvt_30 = null;
	
	final public static Main_v03 getSingleInstance(){
		if (singleInstance == null) {
			synchronized (Main_v03.class) {
				if (singleInstance == null) {
					singleInstance = new Main_v03();
				}
			}
		}
		return singleInstance;
	}
	
	private Main_v03(){
		this.util = new Util_v03();
	}
	
	/**
	 * v3 : up 1 3
	 */
	final public void buyTacticsOne(ArrayList<Integer> list){
		this.dto_dvt_30 = Data.conditionFxManager.getBeili_m30_bot();
		this.dto_dvt_10 = Data.conditionFxManager.getBeili_m10_bot();
		this.dto_dvt_05 = Data.conditionFxManager.getBeili_m05_bot();
		if(list.contains(Mark.Order_Dir_v01)){
			if(null != this.dto_dvt_30 && null != this.dto_dvt_10 && this.up_K30_flag != this.dto_dvt_30.getCno()){
				this.up_K30_flag = this.dto_dvt_30.getCno();
				this.util.exeOne(Mark.Action_Type_Buy, Mark.Order_Dir_v01, this.dto_dvt_30, this.dto_dvt_10, null);
			}
		}
		if(list.contains(Mark.Order_Dir_v02)){
			if(null != this.dto_dvt_30 && null != this.dto_dvt_10 && null != this.dto_dvt_05 && this.up_K30_flag_1 != this.dto_dvt_30.getCno()){
				this.up_K30_flag_1 = this.dto_dvt_30.getCno();
				this.util.exeOne(Mark.Action_Type_Buy, Mark.Order_Dir_v02, this.dto_dvt_30, this.dto_dvt_10, this.dto_dvt_05);
			}
		}
		if(list.contains(Mark.Order_Dir_v03)){
			if(null != this.dto_dvt_10 && null != this.dto_dvt_05 && this.up_K10_flag != this.dto_dvt_10.getCno()){
				this.up_K10_flag = this.dto_dvt_10.getCno();
				this.util.exeOne(Mark.Action_Type_Buy, Mark.Order_Dir_v03, null, this.dto_dvt_10, this.dto_dvt_05);
			}
		}
	}
	
	/**
	 * v3 : dn 1, 3
	 */
	final public void sellTacticsOne(ArrayList<Integer> list){
		this.dto_dvt_30 = Data.conditionFxManager.getBeili_m30_top();
		this.dto_dvt_10 = Data.conditionFxManager.getBeili_m10_top();
		this.dto_dvt_05 = Data.conditionFxManager.getBeili_m05_top();
		if(list.contains(Mark.Order_Dir_v01)){
			if(null != this.dto_dvt_30 && null != this.dto_dvt_10 && this.dn_K30_flag != this.dto_dvt_30.getCno()){
				this.dn_K30_flag = this.dto_dvt_30.getCno();
				this.util.exeOne(Mark.Action_Type_Sell, Mark.Order_Dir_v01, this.dto_dvt_30, this.dto_dvt_10, null);
			}
		}
		if(list.contains(Mark.Order_Dir_v02)){
			if(null != this.dto_dvt_30 && null != this.dto_dvt_10 && null != this.dto_dvt_05 && this.dn_K30_flag_1 != this.dto_dvt_30.getCno()){
				this.dn_K30_flag_1 = this.dto_dvt_30.getCno();
				this.util.exeOne(Mark.Action_Type_Sell, Mark.Order_Dir_v02, this.dto_dvt_30, this.dto_dvt_10, this.dto_dvt_05);
			}
		}
		if(list.contains(Mark.Order_Dir_v03)){
			if(null != this.dto_dvt_10 && null != this.dto_dvt_05 && this.dn_K10_flag != this.dto_dvt_10.getCno()){
				this.dn_K10_flag = this.dto_dvt_10.getCno();
				this.util.exeOne(Mark.Action_Type_Sell, Mark.Order_Dir_v03, null, this.dto_dvt_10, this.dto_dvt_05);
			}
		}
	}
}
