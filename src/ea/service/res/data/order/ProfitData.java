package ea.service.res.data.order;

import java.util.ArrayList;

import ea.service.res.dto.OrderDto;
/**
 * 盈亏数据
 */
public class ProfitData {
	private static ProfitData singleInstance = null;
	private ArrayList<OrderDto> upLoss = new ArrayList<OrderDto>();
	private ArrayList<OrderDto> dnLoss = new ArrayList<OrderDto>();
	
	private ArrayList<OrderDto> upGain = new ArrayList<OrderDto>();
	private ArrayList<OrderDto> dnGain = new ArrayList<OrderDto>();
	
	public static ProfitData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (ProfitData.class) {
				if (singleInstance == null) {
					singleInstance = new ProfitData();
				}
			}
		}
		return singleInstance;
	}
	
	final public void initUpData(OrderDto dto){
		if(dto.getOt_price() > dto.getIn_price()){
			this.upGain.add(dto);
		}else{
			this.upLoss.add(dto);
		}
	}
	
	final public void initDnData(OrderDto dto){
		if(dto.getOt_price() < dto.getIn_price()){
			this.dnGain.add(dto);
		}else{
			this.dnLoss.add(dto);
		}
	}
}
