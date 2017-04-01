package ea.service.res.data;

import java.util.HashMap;


import ea.server.Data;
import ea.service.res.dto.PriceDto;

/**
 * 基本不用
 */
public class RangePriceData {
	
	private HashMap<String,PriceDto> RangePriceDataMap = null;
	
	private static RangePriceData singleInstance = null; //唯一实例
	
	public static RangePriceData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (RangePriceData.class) {
				if (singleInstance == null) {
					singleInstance = new RangePriceData();
				}
			}
		}
		return singleInstance;
	}
	private RangePriceData(){
		RangePriceDataMap = new HashMap<String,PriceDto>();
	}
	/**
	 * 根据CNO得到一分钟K线数据
	 */
	public PriceDto getRangePriceExt(String start, String end){
		PriceDto dto = null;
		String key = start + "_" + end;
		if(this.RangePriceDataMap.containsKey(key)){
			return this.RangePriceDataMap.get(key);
		}else if(this.RangePriceDataMap.size() == 0){
			dto = this.getPriceDto(start, end);
			this.RangePriceDataMap.put(key, dto);
		}else if(this.RangePriceDataMap.size() > 0){
			this.RangePriceDataMap.clear();
			dto = this.getPriceDto(start, end);
			this.RangePriceDataMap.put(key, dto);
		}
		return dto;
	}
	
	/**
	 * 得到时间范围内的最值价格
	 */
	private PriceDto getPriceDto(String start, String end){
		return Data.getDataControl.getPriceDto(start, end);
	}
	
}
