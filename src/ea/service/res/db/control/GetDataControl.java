package ea.service.res.db.control;

import ea.server.Controller;
import ea.service.res.db.service.GetDataService;
import ea.service.res.dto.*;
import ea.service.res.dto.macd.MacdMod;

import java.util.HashMap;
import java.util.List;

public class GetDataControl {
	
	private GetDataService getDataService = (GetDataService)Controller.ct.getBean("getDataService");
    
	private static GetDataControl singleInstance = null;
	
	public static GetDataControl getSingleInstance(){
		if (singleInstance == null) {
			synchronized (GetDataControl.class) {
				if (singleInstance == null) {
					singleInstance = new GetDataControl();
				}
			}
		}
		return singleInstance;
	}
	
	final public CandlesDto getCandle(int period, boolean isTest, int cno, String time) {
        return this.getDataService.getCandle(period, isTest, cno, time);
    }
    /**
     * 根据CNO或time,得到笔段信息
     */
	final public  List<FxMod> getFenBiInfoByType(int period, boolean isTest, Integer cno, Long time) {
    	return this.getDataService.getFenBiInfoByType(period, isTest, cno, time);
    }
    /**
     * 得到MACD区间最值 
     */
	final public  List<MacdMod> getRangeMacdExt(String table, FenBiInfoDto fxDto) {
    	return this.getDataService.getRangeMacdExt(table, fxDto);
    }
    /**
     * 计算区间价格最值
     */
	final public PriceDto getPriceDto(String start, String end){
		return this.getDataService.getPriceDto(start, end);
    }
	/**
	 * 未使用：初始化暂停信息
	 */
	final public List<InitDataMod> initData(String table, int Action_Type_Buy, int Action_Type_Sell){
    	return this.getDataService.initData(table, Action_Type_Buy, Action_Type_Sell);
    }

	final public  HashMap<String,Object> exeSqlToMap(String str){
    	return this.getDataService.exeSqlToMap(str);
    }
    
	final public List<BaseDto> exeSqlToDto(String sql){
    	return this.getDataService.exeSqlToDto(sql);
    }
    
	final public int getCount(String table){
    	return this.getDataService.getCount(table).getNum();
    }
    
	final public int getMaxId(String table){
    	return this.getDataService.getMaxId(table).getNum();
    }
	
	final public int getMaxCno(String table){
    	return this.getDataService.getMaxCno(table).getNum();
    }
	
    /**
     *  003 得到开始和结束时间
     */
	final public BaseDto getMaxMinTime(String table){
    	return this.getDataService.getMaxMinTime(table);
    }
    
	final public boolean isUniqueTime(String table, long time){
    	return this.getDataService.isUniqueTime(table, time).getNum()==0?false:true;
    }
    
	final public int getClearNumByPeriod(int period){
    	return this.getDataService.getClearNumByPeriod(period).getNum();
    }
    
	final public int getCnoByTime(String table, long time){
    	return this.getDataService.getCnoByTime(table, time).getNum();
    }
    
	final public SectionDto getSection(int period, long time){
    	return this.getDataService.getSection(period, time);
    }
    
	final public CandlesDto getM1CandleByM5Cno(int cno){
    	return this.getDataService.getM1CandleByM5Cno(cno);
    }
    
	final public List<BaseDto> getclearCnoPeriods(){
    	return this.getDataService.getclearCnoPeriods();
    }
    
	final public PageDto getPageTime(String table, long start, long end){
    	return this.getDataService.getPageTime(table, start, end);
    }
    /**
     * 020 得到各周期对应的页信息
     */
	final public List<BaseDto> getPageNum(String table, int page){
    	return this.getDataService.getPageNum(table, page);
    }
    /**
     * 021 按年份得到停盘时间的集合
     */
	final public List<BaseDto> getStopTimeByYear(int year){
    	return this.getDataService.getStopTimeByYear(year);
    }
    /**
     * 022 根据时间得到K线数据
     */
	final public CandlesDto getKdataByCno(int period, int cno){
		return this.getDataService.getKdataByCno(period, cno);
    }
	
	final public List<BaseDto> showOrderMonth(int year){
		return this.getDataService.showOrderMonth(year);
	}
	
	final public List<CandlesDto> getCandlesBySql(String sql){
		return this.getDataService.getCandlesBySql(sql);
	}
	/**
	 * 前端显示数据
	 */
	final public List<KlinesDto> getCandlsByPeriod(String table, int period, long time, int direction, int size){
		return this.getDataService.getCandlsByPeriod(table, period, time, direction, size);
	}
	/**
	 * 前端显示数据突破背离数据
	 */
	final public List<BrkDevInfoDto> getBrkDevInfo(int period, long bin, long end){
		return this.getDataService.getBrkDevInfo(period, bin, end);
	}
	
/*    public  boolean isExistRemark(int period, int cno, int type, int dir){
    	return dbSelectService.isExistRemark(period, cno, type, dir).getNum()==0?false:true;
    }*/
}
