package ea.service.res.data.move;

import java.util.HashMap;

import ea.server.Controller;
import ea.service.res.dto.MoveParaDto;
import ea.service.utils.base.Mark;
/**
 * 根据版本移动出场参数初始化
 */
public class MoveParaData {
	private static MoveParaData singleInstance = null;
	private HashMap<Integer, MoveParaDto> map = new HashMap<Integer, MoveParaDto>();
	private MoveParaDto dto = null;
	public static MoveParaData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (MoveParaData.class) {
				if (singleInstance == null) {
					singleInstance = new MoveParaData();
				}
			}
		}
		return singleInstance;
	}
	
	final public MoveParaDto getMoveParaDto(Integer version){
		if(this.map.containsKey(version)){
			return map.get(version);
		}else if(map.size() == 0 || !map.containsKey(version)){
			this.dto = this.initMoveParaDto(version);
			this.map.put(version, this.dto);
		}
		return this.dto;
	}
	
	final private MoveParaDto initMoveParaDto(int version){
		this.dto = new MoveParaDto();
		switch(version){
			case Mark.Version_v01 : this.dto.setStartMove(Controller.startMove_v1);
									this.dto.setMargin(Controller.margin_v1);
									this.dto.setStopLoss(Controller.stopLoss_v1);
									this.dto.setStartProfit(Controller.startProfit_v1);
									this.dto.setStopProfit(Controller.stopProfit_v1);
				break;
			case Mark.Version_v02 : this.dto.setStartMove(Controller.startMove_v2);
									this.dto.setMargin(Controller.margin_v2);
									this.dto.setStopLoss(Controller.stopLoss_v2);
									this.dto.setStartProfit(Controller.startProfit_v2);
									this.dto.setStopProfit(Controller.stopProfit_v2);
				break;
			case Mark.Version_v03 : this.dto.setStartMove(Controller.startMove_v3);
									this.dto.setMargin(Controller.margin_v3);
									this.dto.setStopLoss(Controller.stopLoss_v3);
									this.dto.setStartProfit(Controller.startProfit_v3);
									this.dto.setStopProfit(Controller.stopProfit_v3);
				break;
			case Mark.Version_v04 : this.dto.setStartMove(Controller.startMove_v4);
									this.dto.setMargin(Controller.margin_v4);
									this.dto.setStopLoss(Controller.stopLoss_v4);
									this.dto.setStartProfit(Controller.startProfit_v4);
									this.dto.setStopProfit(Controller.stopProfit_v4);
				break;
			case Mark.Version_v05 : this.dto.setStartMove(Controller.startMove_v5);
									this.dto.setMargin(Controller.margin_v5);
									this.dto.setStopLoss(Controller.stopLoss_v5);
									this.dto.setStartProfit(Controller.startProfit_v5);
									this.dto.setStopProfit(Controller.stopProfit_v5);
				break;
		}
		return this.dto;
	}
}
