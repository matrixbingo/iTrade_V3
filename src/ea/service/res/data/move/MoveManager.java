package ea.service.res.data.move;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.OrderDto;
import ea.service.utils.base.Mark;
/**
 * 移动出场中控制
 */
public class MoveManager {
	private HashMap<String, MoveData> moveDatas = new HashMap<String, MoveData>();	//移动出场map
	private ArrayList<Integer> list = new ArrayList<Integer>();
	private static MoveManager singleInstance = null;
	private boolean state = false;
	private MoveData moveData = null;
	private int type = 0;
	private Iterator<Entry<String, MoveData>> itmap = null;
	private Iterator<Integer> itlist = null;
	
	public static MoveManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (MoveManager.class) {
				if (singleInstance == null) {
					singleInstance = new MoveManager();
				}
			}
		}
		return singleInstance;
	}
	/**
	 * 每分钟执行一次：计算map中的movedata
	 */
	final public void runMoveOutMarket(CandlesDto dto_m1){
/*		this.hasDn = Data.orderData.hasDn();
		this.hasUp = Data.orderData.hasUp();*/
		if(Controller.isMoveOutMarket && (Data.orderData.hasDn() || Data.orderData.hasUp())){
			this.itmap = this.moveDatas.entrySet().iterator();
			while (itmap.hasNext()) {
				this.moveData = itmap.next().getValue();
			    this.state = this.moveData.getState();
			    this.type = this.moveData.getType();
				if(this.state == true && this.type == Mark.Action_Type_Sell){
					this.moveData.runMoveSell(dto_m1, this.moveData.getIno());
				}else if(this.state == true && this.type == Mark.Action_Type_Buy){
					this.moveData.runMoveBuy(dto_m1, this.moveData.getIno());
				}
			}
		}
	}
	/**
	 * 每30分钟执行一次：根据一出场list清空map中的movedata
	 */
	final public void clearAllIds(){
		if(Controller.isMoveOutMarket && !this.list.isEmpty() && this.moveDatas.size() > 200 || this.list.size() > 10){
			this.itlist = this.list.iterator();
			while(this.itlist.hasNext()){
				this.moveDatas.remove(this.itlist.next());
			}
			this.list.clear();
		}
	}
	
	final public void addMoveDatas(OrderDto dto){
		this.addMoveDatas(dto.getKey(), new MoveData(dto.getVersion(), dto.getDir(), dto.getDev_in_dvt(), dto.getIn_price()));		// move out market
	}
	
	final public void addRemoveIds(Integer id){
		this.list.add(id);
	}
	final public void addMoveDatas(String key, MoveData data) {
		this.moveDatas.put(key, data);
	}
	final public void setMoveDatas(HashMap<String, MoveData> moveDatas) {
		this.moveDatas = moveDatas;
	}
}
