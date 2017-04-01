package ea.server;

import java.util.HashMap;
import java.util.List;

import ea.service.res.data.order.OrderData;
import ea.service.res.dto.OrderDto;
import ea.service.utils.base.Mark;

public class InitData {

	public void initData(){
		HashMap<String, OrderDto> upMap = new HashMap<String, OrderDto>();
		HashMap<String, OrderDto> dnMap = new HashMap<String, OrderDto>();
		List<OrderDto> sels = Data.exeDataControl.getOrderDtos(Mark.Action_Type_Sell);
		List<OrderDto> buys = Data.exeDataControl.getOrderDtos(Mark.Action_Type_Buy);
		
		for(OrderDto dto : sels){
			dnMap.put(dto.getKey(), dto);
		}
		
		for(OrderDto dto : buys){
			upMap.put(dto.getKey(), dto);
		}
		OrderData.getSingleInstance().setUpMap(upMap);
		OrderData.getSingleInstance().setDnMap(dnMap);
	}
	
	public static void main(String[] args) {
		new InitData().initData();
	}

}
