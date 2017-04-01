package ea.service.res.db.service;

import ea.server.Controller;
import ea.service.res.db.mapper.GetDataMapper;
import ea.service.res.dto.*;
import ea.service.res.dto.macd.MacdMod;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

//表明该文件需要事务
@Transactional
// 表明该文件是一个Service
@Service
public class GetDataService{

    // 这个属性由Spring帮我们注入。也就是说我们无需写IUserDao userDao = new IUserDao();,Spring会帮我们new一个的
    // MyBatis帮我们管理xml与类的映射及Dao，所以我们直接用@Autowired进行注入就可以了
    @Autowired
    private GetDataMapper getDataMapper;
    private HashMap<String, Object> map = new HashMap<String, Object>();
    
    public CandlesDto getCandle(int period, boolean isTest, int cno, String time){
		this.map.put("table",Util.getTabNameByPeriod(period));
		this.map.put("isTest",true==isTest?1:0);
		this.map.put("cno", cno);
		this.map.put("period", period);
		this.map.put("time", time);
		
        try {
        	return this.getDataMapper.getCandle(map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getCandle");
            e.printStackTrace();
        }
        return null;
    }
    
    public List<FxMod> getFenBiInfoByType(int period, boolean isTest, Integer cno, Long time){
    	this.map.put("period",period);
    	this.map.put("table",Util.getTabNameByPeriod(period));
    	this.map.put("isTest",isTest);
    	this.map.put("cno", null==cno?0:cno);
    	this.map.put("time", null==time?0:time);
        try {
        	return this.getDataMapper.getFenBiInfoByType(map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getFenBiInfo");
            e.printStackTrace();
        }
        return null;
    }
    
    public List<MacdMod> getRangeMacdExt(String table, FenBiInfoDto fxDto){
     	this.map.put("table",table);
    	this.map.put("c1",fxDto.getC1()); this.map.put("c2",fxDto.getC2()); this.map.put("c3",fxDto.getC3());
    	this.map.put("c4",fxDto.getC4()); this.map.put("c5",fxDto.getC5()); this.map.put("c6",fxDto.getC6());
    	this.map.put("period",fxDto.getPeriod());
        try {
        	return this.getDataMapper.getRangeMacdExt(map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getRangeMacdExt");
            e.printStackTrace();
        }
        return null;
    }
    
    public PriceDto getPriceDto(String start, String end){
    	this.map.put("start",start);
    	this.map.put("end",end);
        try {
        	return this.getDataMapper.getPriceDto(map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getPriceDto");
            e.printStackTrace();
        }
        return null;
    }
    
    public List<InitDataMod> initData(String table, int Action_Type_Buy, int Action_Type_Sell){
    	this.map.put("table",table);
    	this.map.put("Action_Type_Buy",Action_Type_Buy);
    	this.map.put("Action_Type_Sell",Action_Type_Sell);
        try {
        	return this.getDataMapper.initData(map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.initData");
            e.printStackTrace();
        }
        return null;
    }
    
    public HashMap<String,Object> exeSqlToMap(String sql){
    	try {
    		return this.getDataMapper.exeSqlToMap(sql);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.exeSqlToMap");
            e.printStackTrace();
        }
        return null;
    }
    
    public List<BaseDto> exeSqlToDto(String sql){
    	try {
    		return this.getDataMapper.exeSqlToDto(sql);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.exeSqlToDto");
            e.printStackTrace();
        }
        return null;
    }

    
    public BaseDto getCount(String table){
    	try {
    		return this.getDataMapper.getCount(table);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getCount");
            e.printStackTrace();
        }
        return null;
    }
    
    public BaseDto getMaxId(String table){
    	try {
    		return this.getDataMapper.getMaxId(table);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getMaxId");
            e.printStackTrace();
        }
        return null;
    }
    
    public BaseDto getMaxCno(String table){
    	try {
    		BaseDto dto = this.getDataMapper.getMaxCno(table);
    		if(null == dto){
    			dto = new BaseDto();
    			dto.setNum(0);
    			return dto;
    		}
    		return dto;
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getMaxCno");
            e.printStackTrace();
        }
        return null;
    }
    
    public BaseDto getMaxMinTime(String table){
    	try {
    		return this.getDataMapper.getMaxMinTime(table);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getMaxMinTime");
            e.printStackTrace();
        }
    	 return null;
    }
    
    public BaseDto isUniqueTime(String table, long time){
    	try {
    		return this.getDataMapper.isUniqueTime(table, time);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.isUniqueTime");
            e.printStackTrace();
        }
    	return null;
    }
    
    public BaseDto getClearNumByPeriod(int period){
    	try {
    		return this.getDataMapper.getClearNumByPeriod(period);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getClearNumByPeriod");
            e.printStackTrace();
        }
    	return null;
    	
    }
    
    public BaseDto getCnoByTime(String table, long time){
    	try {
    		return this.getDataMapper.getCnoByTime(table, time);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getCnoByTime");
            e.printStackTrace();
        }
    	return null;
    }
    
    public SectionDto getSection(int period, long time){
    
    	this.map.put("period",period);
    	this.map.put("time",time);
    	try {
    		SectionDto dto = this.getDataMapper.getSection(map);
    		if(null != dto){
    			dto.setPeriod(period);
    			return dto;
    		}
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getSection");
            e.printStackTrace();
        }
    	return null;
    }
    
    public BaseDto isExistRemark(int period, int cno, int type, int dir){
    	try {
    		return this.getDataMapper.isExistRemark(period, cno, type, dir);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.isExistRemark");
            e.printStackTrace();
        }
    	return null;
    }
    
    public CandlesDto getM1CandleByM5Cno(int cno){
    	try {
    		return this.getDataMapper.getM1CandleByM5Cno(cno);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getM1CandleByM5Cno");
            e.printStackTrace();
        }
    	return null;
    }
    
    public List<BaseDto> getclearCnoPeriods(){
    	this.map.put("p_dev", Mark.Action_Type_beili);
    	this.map.put("p_brk", Mark.Action_Type_break);
    	try {
    		return this.getDataMapper.getclearCnoPeriods(map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getclearCnoPeriods");
            e.printStackTrace();
        }
    	return null;
    }
    
    public PageDto getPageTime(String table, long start, long end){
    	try {
    		return this.getDataMapper.getPageTime(table, start, end);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getPageTime");
            e.printStackTrace();
        }
    	return null;
    }
    
    public List<BaseDto> getPageNum(String table, int page){
    	try {
    		return this.getDataMapper.getPageNum(table, page);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getPageNum");
            e.printStackTrace();
        }
    	return null;
    }
    
    public List<BaseDto> getStopTimeByYear(int year){
    	try {
    		return this.getDataMapper.getStopTimeByYear(year);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getStopTimeByYear");
            e.printStackTrace();
        }
    	return null;
    }
    
    public CandlesDto getKdataByCno(int period, int cno){
    	try {
    		return this.getDataMapper.getKdataByCno(period, cno);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getKdataByCno");
            e.printStackTrace();
        }
    	return null;
    }
    
	public List<BaseDto> showOrderMonth(int year){
		try {
    		return this.getDataMapper.showOrderMonth(year);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.showOrderMonth");
            e.printStackTrace();
        }
    	return null;
	}
	
	public List<CandlesDto> getCandlesBySql(String sql){
		try {
    		return this.getDataMapper.getCandlesBySql(sql);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getCandlesBySql");
            e.printStackTrace();
        }
    	return null;
	}
	
	public List<KlinesDto> getCandlsByPeriod(String table, int period, long time, int direction, int size){
    	this.map.put("table",table);
    	this.map.put("period",period);
    	this.map.put("direction",direction);
    	this.map.put("time",time);
    	this.map.put("size",size);
        try {
        	return this.getDataMapper.getCandlsByPeriod(this.map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getCandlsByPeriod");
            e.printStackTrace();
        }
        return null;
    }
	
	public List<BrkDevInfoDto> getBrkDevInfo(int period, long bin, long end){
		this.map.put("period",period);
    	this.map.put("bin",bin);
    	this.map.put("end",end);
    	try {
        	return this.getDataMapper.getBrkDevInfo(this.map);
        } catch (Exception e) {
        	Controller.log.error("查询错误：GetDataService.getBrkDevInfo");
            e.printStackTrace();
        }
        return null;
	}
}

