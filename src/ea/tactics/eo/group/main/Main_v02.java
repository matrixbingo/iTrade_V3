package ea.tactics.eo.group.main;

import java.util.ArrayList;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakDto;
import ea.service.utils.base.Mark;
import ea.tactics.eo.group.util.Util_v02;

@SuppressWarnings("unused")
public class Main_v02 {
	private static Main_v02 singleInstance = null;
	
	private Util_v02 util = null;
	private BreakDto dto = null;

	private int dn_K30_flag = 0, up_K30_flag = 0, dn_K10_flag = 0, up_K10_flag = 0;
	private BeiliDto dto_dvt_05 = null, dto_dvt_10 = null, dto_dvt_30 = null;
	
	final public static Main_v02 getSingleInstance(){
		if (singleInstance == null) {
			synchronized (Main_v02.class) {
				if (singleInstance == null) {
					singleInstance = new Main_v02();
				}
			}
		}
		return singleInstance;
	}
	
	private Main_v02(){
		this.util = new Util_v02();
	}
	
	/**
	 * v1 buy
	 */
	final public void buyTacticsOne(ArrayList<Integer> list){
		this.dto_dvt_30 = Data.conditionManager.getBeili_m30_bot1();
		
		if(list.contains(Mark.Order_Dir_v01)){
			if(null != this.dto_dvt_30 && this.dto_dvt_30.getUpdn() == Mark.Beili_Bot && this.up_K30_flag != this.dto_dvt_30.getCno()){
				this.up_K30_flag = this.dto_dvt_30.getCno();
				this.util.buy(this.dto_dvt_30);
			}
		}
	}
	
	/**
	 * v1 sell
	 */
	final public void sellTacticsOne(ArrayList<Integer> list){
		this.dto_dvt_30 = Data.conditionManager.getBeili_m30_top1();
	
		if(list.contains(Mark.Order_Dir_v01)){
			if(null != this.dto_dvt_30 && this.dto_dvt_30.getUpdn() == Mark.Beili_Top && this.dn_K30_flag != this.dto_dvt_30.getCno()){
				this.dn_K30_flag = this.dto_dvt_30.getCno();
				this.util.sell(this.dto_dvt_30);
			}
		}
	}
}
