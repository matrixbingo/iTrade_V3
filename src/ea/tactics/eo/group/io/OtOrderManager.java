package ea.tactics.eo.group.io;

import java.util.ArrayList;
import java.util.Iterator;

import ea.server.Data;
import ea.service.res.dto.InListDto;
import ea.service.res.dto.OrderDto;
import ea.service.utils.base.Mark;
/**
 * 出场管理：包括监听
 */
public class OtOrderManager {
	private static OtOrderManager singleInstance = null;
	private InListDto dto = null;
	private Iterator<InListDto> it = null;
	
	public static OtOrderManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (OtOrderManager.class) {
				if (singleInstance == null) {
					singleInstance = new OtOrderManager();
				}
			}
		}
		return singleInstance;
	}
	
	final public void otMarket(ArrayList<InListDto> list){
		this.it = list.iterator();
		while(this.it.hasNext()){
			this.dto = this.it.next();
			Data.orderData.otOrder(this.dto.getVersion(), this.dto.getDir(), this.dto.getList(), this.dto.getType());
		}
	}

	/**
	 * 出场监听 : OrderData 调用
	 */
	final public boolean otListen(OrderDto dto){
		switch(dto.getVersion()){
			case Mark.Version_v04 : return true;
		}
		return true;
	}
}
