package ea.service.res.data.order;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.data.move.MoveData;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.OrderDto;
import ea.service.utils.base.Mark;

public class OrderData {
	private static OrderData singleInstance = null;
	private HashMap<String, OrderDto> upMap = new HashMap<String, OrderDto>();
	private HashMap<String, OrderDto> dnMap = new HashMap<String, OrderDto>();
	private Iterator<Entry<String, OrderDto>> it = null;
	private Iterator<OrderDto> iter = null;
	private String key = null;
	private Entry<String, OrderDto> entry = null;
	private OrderDto dto = null;
	private CandlesDto dto_k_01 = null;
	private ArrayList<OrderDto> clearList = new ArrayList<OrderDto>();
	private int upflag = 0, dnflag = 0;
	
	public static OrderData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (OrderData.class) {
				if (singleInstance == null) {
					singleInstance = new OrderData();
				}
			}
		}
		return singleInstance;
	}
	
	/**
	 * 进多
	 */
	final public void inUpOrder(OrderDto dto){
		if(this.checkInOrder(this.upflag, this.upMap, dto)){
			if(Controller.isMoveOutMarket && dto.isMove()){		//move out market
				Data.moveManager.addMoveDatas(dto.getKey(), new MoveData(dto.getVersion(), Mark.Action_Type_Buy, dto.getDev_in_dvt(), dto.getIn_price()));		// move out market
			}
			Data.exeDataControl.addOrder(dto);
		}
	}
	/**
	 * 进空
	 */
	final public void inDnOrder(OrderDto dto){
		if(this.checkInOrder(this.dnflag, this.dnMap, dto)){	
			if(Controller.isMoveOutMarket && dto.isMove()){		//move out marke
				Data.moveManager.addMoveDatas(dto.getKey(), new MoveData(dto.getVersion(), Mark.Action_Type_Sell, dto.getDev_in_dvt(), dto.getIn_price()));	// move out market
			}
			Data.exeDataControl.addOrder(dto);
		}
	}
	/**
	 * 根据 version, dir, type  出场
	 */
	final public void otOrder(int version, int dir, ArrayList<Integer> types, int type){
		//-- step 1 : 根据type和 version 出场
		if(dir == Mark.Action_Type_Sell){
			this.it = this.dnMap.entrySet().iterator();
		}else{
			this.it = this.upMap.entrySet().iterator();
		}
		this.clearList.clear();
		while (this.it.hasNext()) {
		    this.entry = this.it.next();
		    if(this.entry.getKey().startsWith(String.valueOf(version))){
		    	this.dto = this.entry.getValue();
		    	if(types.contains(this.dto.getType())){
		    		this.initOtOrderDto(this.dto);
			    	if(dir == Mark.Action_Type_Sell){
			    		this.otDnOrder(this.dto, type);
			    	}else{
			    		this.otUpOrder(this.dto, type);
			    	}
		    	}
		    }
		}
		
		//-- step 2 : 删除已经出场的DTO
		switch(dir){
			case Mark.Action_Type_Sell : this.removeListen(Mark.Action_Type_Sell, this.clearList);
				break;
			case Mark.Action_Type_Buy  : this.removeListen(Mark.Action_Type_Buy, this.clearList);
				break;
		}
	}
	
	/**
	 * 出多
	 */
	final private void otUpOrder(OrderDto dto){
		if(this.checkOtOrder(this.upMap, dto) && Data.otOrderManager.otListen(dto)){
			Data.exeDataControl.updateOrder(dto);
			this.clearList.add(this.dto);	//-- 添加需要删除的DTO
		}
	}
	final private void otUpOrder(OrderDto dto, int type){
		if(type == Mark.OutMarket_No){
			this.otUpOrder(dto);
		}else if(type == Mark.OutMarket_1){
			if(dto.getOt_price() < dto.getIn_price()){
				this.otUpOrder(dto);
			}else{
				Data.moveManager.addMoveDatas(dto);		//move out market
			}
		}else if(type == Mark.OutMarket_2){
			if(dto.getOt_price() < dto.getIn_price()){
				this.otUpOrder(dto);
			}
		}
	}
	/**
	 * 出空
	 */
	final private void otDnOrder(OrderDto dto){
		if(this.checkOtOrder(this.dnMap, dto) && Data.otOrderManager.otListen(dto)){
			Data.exeDataControl.updateOrder(dto);
			this.clearList.add(this.dto);	//-- 添加需要删除的DTO
		}
	}
	final private void otDnOrder(OrderDto dto, int type){
		if(type == Mark.OutMarket_No){
			this.otDnOrder(dto);
		}else if(type == Mark.OutMarket_1){
			if(dto.getOt_price() > dto.getIn_price()){
				this.otDnOrder(dto);
			}else{
				Data.moveManager.addMoveDatas(dto);		//move out market
			}
		}else if(type == Mark.OutMarket_2){
			if(dto.getOt_price() > dto.getIn_price()){
				this.otDnOrder(dto);
			}
		}
	}
	/**
	 * 出场监听：1:删除进场单，2设置盈亏数据
	 */
	final private void removeListen(int dir, ArrayList<OrderDto> list){
		if(!list.isEmpty()){
			this.iter = list.iterator();
			if(dir == Mark.Action_Type_Buy){
				while(this.iter.hasNext()){
					this.dto = this.iter.next();
					this.upMap.remove(this.dto.getKey());
					Data.profitData.initUpData(this.dto);
				}
			}else{
				while(this.iter.hasNext()){
					this.dto = this.iter.next();
					this.dnMap.remove(this.dto.getKey());
					Data.profitData.initDnData(this.dto);
				}
			}
		}
	}
	/**
	 * 入场检验：相对key不重复入场
	 */
	final private boolean checkInOrder(int flag, HashMap<String,OrderDto> map, OrderDto dto){
		this.key = dto.getKey();
		if(flag == 0 && map.size() == 0){
			map.put(this.key, dto);
			flag = 1;
			return true;
		}else if(map.containsKey(this.key)){
			return false;
		}else{
			map.put(this.key, dto);
			return true;
		}
	}
	/**
	 * 出场检验：不重复出场,有单出，无单不操作
	 */
	final private boolean checkOtOrder(HashMap<String,OrderDto> map, OrderDto dto){
		if(map.containsKey(dto.getKey())){
			return true;
		}else{
			return false;
		}
	}
		
	final public HashMap<String, OrderDto> getUpMap() {
		return this.upMap;
	}

	final public void setUpMap(HashMap<String, OrderDto> upMap) {
		this.upMap = upMap;
	}

	final public HashMap<String, OrderDto> getDnMap() {
		return this.dnMap;
	}

	final public void setDnMap(HashMap<String, OrderDto> dnMap) {
		this.dnMap = dnMap;
	}

	/**
	 * 得到是否有多单
	 */
	final public boolean hasUp(){
		if(this.upMap.isEmpty()){
			return false;
		}
		return true;
	}
	/**
	 * 得到是否有空单
	 */
	final public boolean hasDn(){
		if(this.dnMap.isEmpty()){
			return false;
		}
		return true;
	}
	
	final private void initOtOrderDto(OrderDto dto){
		this.dto_k_01 = Data.conditionManager.getDto_k_01();
    	dto.setOcno(this.dto_k_01.getCno());
    	dto.setOt_price(this.dto_k_01.getClose());
    	dto.setOt_time(this.dto_k_01.getTime());
	}
}
