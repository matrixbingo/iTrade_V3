package ea.service.res.db.mapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import ea.service.res.dto.BaseDto;
import ea.service.res.dto.BrkDevInfoDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FxMod;
import ea.service.res.dto.InitDataMod;
import ea.service.res.dto.KlinesDto;
import ea.service.res.dto.PageDto;
import ea.service.res.dto.PriceDto;
import ea.service.res.dto.SectionDto;
import ea.service.res.dto.macd.MacdMod;

public interface GetDataMapper{

	public CandlesDto getCandle(Map<String, Object> map);
	
	public List<FxMod> getFenBiInfoByType(Map<String, Object> map);
	
	public List<MacdMod> getRangeMacdExt(Map<String, Object> map);
	
	public PriceDto getPriceDto(Map<String, Object> map);
	
	public List<InitDataMod> initData(Map<String, Object> map);
	
	public HashMap<String,Object> exeSqlToMap(@Param("sql") String sql);
	
	public List<BaseDto> exeSqlToDto(@Param("sql") String sql);
	
	public BaseDto getCount(@Param("table") String table);
	
	public BaseDto getMaxId(@Param("table") String table);
	
	public BaseDto getMaxCno(@Param("table") String table);
	
	public BaseDto getMaxMinTime(@Param("table") String table);
	
	public BaseDto isUniqueTime(@Param("table") String table, @Param("time") long time);
	
	public BaseDto getClearNumByPeriod(@Param("period") int period);
	
	public BaseDto getCnoByTime(@Param("table") String table, @Param("time") long time);
	
	public SectionDto getSection(Map<String, Object> map);
	
	public BaseDto isExistRemark(@Param("period") int period, @Param("cno") int cno, @Param("type") int type, @Param("dir") int dir);
	
	public CandlesDto getM1CandleByM5Cno(@Param("cno") int cno);
	
	public List<BaseDto> getclearCnoPeriods(Map<String, Object> map);
	
	public PageDto getPageTime(@Param("table") String table, @Param("start") long start, @Param("end") long end);

	public List<BaseDto> getPageNum(@Param("table") String table, @Param("page") int page);
	
	public List<BaseDto> getStopTimeByYear(@Param("year") int year);
	
	public CandlesDto getKdataByCno(@Param("period") int period, @Param("cno") int cno);
	
	public List<BaseDto> showOrderMonth(@Param("year") int year);
	
	public List<CandlesDto> getCandlesBySql(@Param("sql") String sql);
	
	public List<KlinesDto> getCandlsByPeriod(Map<String, Object> map);
	
	public List<BrkDevInfoDto> getBrkDevInfo(Map<String, Object> map);
}
