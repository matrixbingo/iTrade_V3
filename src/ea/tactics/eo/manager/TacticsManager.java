package ea.tactics.eo.manager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import ea.service.res.dto.InListDto;
import ea.service.utils.base.Mark;
import ea.tactics.eo.control.TacticsServer;
import ea.tactics.eo.group.help.TecticsExeServer;

public class TacticsManager extends TacticsServer {
	private static TacticsManager singleInstance = null;
	private Iterator<InListDto> it = null;
	private HashMap<Integer, TecticsExeServer> map = null;
	private InListDto dto = null;
	
	final public static TacticsManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (TacticsManager.class) {
				if (singleInstance == null) {
					singleInstance = new TacticsManager();
				}
			}
		}
		return singleInstance;
	}
	
	final public void exeTactics(ArrayList<InListDto> list){
		if(null == this.map){
			this.map = this.loadMap();
		}
		if(!list.isEmpty()){
			this.it = list.iterator();
			while(this.it.hasNext()){
				this.dto = this.it.next();
				this.map.get(this.dto.getVersion()).exe(this.dto);
			}
		}
	}

	public static void main(String[] args) {
		ArrayList<InListDto> ilist_05 = new ArrayList<InListDto>();
		ArrayList<Integer> list = new ArrayList<Integer>();
		list.add(Mark.Order_Dir_v01);
/*		ilist_05.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, list));  // 空
		ilist_05.add(new InListDto(Mark.Version_v02, Mark.Action_Type_Sell, list));
		ilist_05.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Sell, list));
		ilist_05.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Buy, list));	 // 多
		ilist_05.add(new InListDto(Mark.Version_v02, Mark.Action_Type_Buy, list));	 // 多
*/		
		//map.put(Mark.Version_v01, Mark.Action_Type_Buy);
		//map.put(Mark.Version_v02, Mark.Action_Type_Sell);
		TacticsManager.getSingleInstance().exeTactics(ilist_05);
	}
}
