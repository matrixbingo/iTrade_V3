package ea.service.res.db.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import ea.service.res.data.indicator.KDDto;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.DevBrkDto;
import ea.service.res.dto.OrderDto;

public interface ExeDataMapper{
	   
	public void truncateTable(@Param("table") String table);
	
	public List<BaseDto> exeFx(@Param("period") int period, @Param("cno") int cno, @Param("fx_cno") int fx_cno);
	
	public void addRemark(Map<String, Object> map);
	
	public void addDevRemark(DevBrkDto dto);
	
	public void addBrkRemark(Map<String, Object> map);
	
	public List<BaseDto> clearRemarkByPeriod(@Param("periods") String periods);
	
	public void exeSql(@Param("sql") String sql);
	
	public void changeEngine(@Param("table") String table, @Param("type") String type);
	
	public void saveTable(@Param("table") String table, @Param("year") String year);
	
	public void addOrder(OrderDto dto);
	
	public void updateOrder(OrderDto dto);
	
	public BaseDto checkBreakMin(@Param("period") int period, @Param("bin_cno") int bin_cno, @Param("end_cno") int end_cno);
	
	public BaseDto checkBreakMax(@Param("period") int period, @Param("bin_cno") int bin_cno, @Param("end_cno") int end_cno);
	
	public void addForm(@Param("period") int period, @Param("cno") int cno, @Param("dir") int dir);
	
	public void addCandleByTab(@Param("table") String table, @Param("cno") long cno, @Param("time") long time, @Param("open") double open, @Param("close") double close, @Param("high") double high, @Param("low") double low);

	public List<OrderDto> getOrderDtos(@Param("dir") int dir);
	
	public void addKD(KDDto dto);
}
