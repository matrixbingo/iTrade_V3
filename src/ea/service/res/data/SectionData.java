package ea.service.res.data;

import java.util.HashMap;

import ea.server.Data;
import ea.service.res.dto.SectionDto;
import ea.service.utils.base.Mark;

public class SectionData {
	
	private HashMap<String,SectionDto> se1Map = null;
	private SectionDto dto = null;
	private static SectionData singleInstance = null; //唯一实例
	
	public static SectionData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (SectionData.class) {
				if (singleInstance == null) {
					singleInstance = new SectionData();
				}
			}
		}
		return singleInstance;
	}
	
	private SectionData(){
		this.se1Map = new HashMap<String,SectionDto>();
	}
	
	public boolean checkBreak(int type, int period, int bin_cno, int end_cno){
		switch(type){
			case Mark.Break_Top : return Data.exeDataControl.checkBreakMin(period, bin_cno, end_cno);
			case Mark.Break_Bot : return Data.exeDataControl.checkBreakMax(period, bin_cno, end_cno);
		}
		return false;
	}
	/**
	 * 向remark表，添加特征序列
	 
	private void addSection(SectionDto dto){
		if(Controller.isRemark_sectn){
			String key = dto.getPeriod()  + "_" +  dto.getTop_time() + "_" + dto.getBot_time();
			if(this.se1Map.containsKey(key)){
				return;
			}else{
				//Basic.setSectionRemark(dto);
				this.se1Map.put(key, dto);
			}
		}
	}
	/**
	 * 根据结束时间time得到特征序列
	 */
	final public SectionDto getSection(int period, long time){
		this.dto = new SectionDto();
		String key = new StringBuffer().append(period).append("_").append(time).toString();
		if(this.se1Map.containsKey(key)){
			return this.se1Map.get(key);
		}else if(this.se1Map.size() == 0){
			this.dto = this.getSectionByDb(period, time);
			this.se1Map.put(key, this.dto);
		}else if(this.se1Map.size() > 0){
			this.se1Map.clear();
			this.dto = this.getSectionByDb(period, time);
			this.se1Map.put(key, this.dto);
		}
		return this.dto;
	}
	
	/**
	 * 得到特征序列高低点
	 */
	final private SectionDto getSectionByDb(int period, long time){
		return Data.getDataControl.getSection(period, time);
	}
}
