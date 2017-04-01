package ea.service.res.data.condition;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.data.condition.control.ConditionFxServer;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakDto;

public class ConditionFxManager  extends ConditionFxServer{
	private static ConditionFxManager singleInstance = null; 
	
	public static ConditionFxManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (ConditionFxManager.class) {
				if (singleInstance == null) {
					singleInstance = new ConditionFxManager();
				}
			}
		}
		return singleInstance;
	}
	
	/**
	 * 添加beili到数据库和DTO
	 */
	final public void addBeiliRemark(BeiliDto dto){
		if(dto.isBeili()){
			if(Controller.isRemark_beili){
				Data.remarksData.addDevRemark(dto);
			}
			super.addBeili(dto);
		}
	}
	
	/**
	 * 添加break到数据库
	 */
	final public void addBreakRemark(BreakDto dto){
		if(dto.isBreak()){
			/*if(Controller.isRemark_break){
				Data.remarksData.addBrkRemark(dto);
			}*/
			//super.addBreak(dto);
		}
	}
}
