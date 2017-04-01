package ea.service.res.data.page;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.data.page.control.PageServer;
import ea.service.res.data.page.futrue.PageManagerNew;
import ea.service.res.db.dao.DBComm;
import ea.service.res.db.dao.MySql_DB;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.PageDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;

public class PageManager extends PageServer{
	private ResultSet rs = null;
	private HashMap<Long, CandlesDto> hashmap = null;
	private static PageManager singleInstance = null;
	private List<BaseDto> list = null;
	private Iterator<BaseDto> it = null;
	private Map.Entry<Integer, BaseDto> entry = null;
	private Iterator<Entry<Integer, BaseDto>> iter = null;

	public static PageManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (PageManager.class) {
				if (singleInstance == null) {
					singleInstance = new PageManager();
				}
			}
		}
		return singleInstance;
	}

	/**
	 * Step001：根据时间和周期得到time在第几页
	 */	
	final private int getPageNumByPeriod(int period, long time){
		switch(period){
			case Mark.Period_M01	 : 
				if(null == this.num_map_m01){
					return this.initNumMap(period, time);
				}
				return this.getPageNum(period, this.num_map_m01, time);
			case Mark.Period_M05  :
				if(null == this.num_map_m05){
					return this.initNumMap(period, time);
				}
				return this.getPageNum(period, this.num_map_m05, time);
			case Mark.Period_M10 :
				if(null == this.num_map_m10){
					return this.initNumMap(period, time);
				}
				return this.getPageNum(period, this.num_map_m10, time);
			case Mark.Period_M30 :
				if(null == this.num_map_m30){
					return this.initNumMap(period, time);
				}
				return this.getPageNum(period, this.num_map_m30, time);
			case Mark.Period_H01 :
				if(null == this.num_map_h01){
					return this.initNumMap(period, time);
				}
				return this.getPageNum(period, this.num_map_h01, time);
			case Mark.Period_H04 :
				if(null == this.num_map_h04){
					return this.initNumMap(period, time);
				}
				return this.getPageNum(period, this.num_map_h04, time);
		}
		return this.page_no;
	}
	/**
	 * 初始化所有周期对应的页信息，并返回time所在的哪页：page_m0* 
	 */
	final private int initNumMap(int period, long time){
		this.list = Data.getDataControl.getPageNum(Util.getTabNameByPeriod(period), Controller.pageNums);
		int page = this.page_no;
		this.map = new HashMap<Integer, BaseDto>();
		this.it = this.list.iterator();
		while (this.it.hasNext()) {
			this.dto = this.it.next();
			this.map.put(this.dto.getNum(), this.dto);
			if(Util.isTimeBetweenClose(time, this.dto.getBin(), this.dto.getEnd())){
				page = this.dto.getNum();
			}	
		}
		if(page != this.page_no){
			this.initNumMap(period, this.map);
		}
		return page;
	}

	/**
	 * Step002：根据周期和页数得到PageDto，如果首次访问则初始化相应周期的PageDto
	 */
	final private PageDto getPageDto(int period, int page){
		if(this.isCurrPage(period, page) && page != this.page_no){
			return this.getCurrPageDto(period);
		}else if(page == this.page_no){
			return null;
		}

		this.hashmap = new HashMap<Long,CandlesDto>((int) (Controller.pageNums * 1.2));
		Data.fxManager.initMapByPeriod(period);
		int start = (page-1) * Controller.pageNums;
		int end   = page * Controller.pageNums;
		this.pdto = this.getPageTime(period, page);
		long time = Mark.No_Time;
		this.rs = DBComm.executeQuery(super.getSql(period, start, end));
		try {
			while(rs.next()){
				CandlesDto dto = new CandlesDto();
				time = rs.getLong("time");
				
				dto.setCno(rs.getInt("cno"));
				dto.setPeriod(period);
				dto.setTime(time);
				dto.setOpen(rs.getDouble("open"));
				dto.setClose(rs.getDouble("close"));
				dto.setHigh(rs.getDouble("high"));
				dto.setLow(rs.getDouble("low"));
				dto.setBar(rs.getDouble("bar"));
				
				this.hashmap.put(time, dto);
				Data.fxManager.addDtoByPeriod(period, dto);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				MySql_DB.getSingleInstance().close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		if(map.isEmpty()){
			return null;
		}
		this.pdto.setMap(this.hashmap);
		this.pdto.setPage(page);
		this.pdto.setPeriod(period);
		this.initCurrPageInfo(period, page, this.pdto);
		return this.pdto;
	}

	final private int getPageNum(int period, HashMap<Integer, BaseDto> map, long time){
		int page = this.page_no;
		if(this.isTimeBetweenClose(period, time)){
			return this.getCurrPage(period);
		}
		this.iter = map.entrySet().iterator();
		
		while (this.iter.hasNext()) { 
			this.entry = this.iter.next();
			this.dto = entry.getValue();
		    if(time >= this.dto.getBin() && time <= this.dto.getEnd()){
		    	page = this.entry.getKey();
		    	break;
		    }
		}
		return page;
	}
	
	/**
	 * 根据周期和时间得到对应的K线数据 ： 对外使用
	 */
	final public CandlesDto getCandlesDtoByTime(int period, long time){
		if(true){
			return PageManagerNew.getSingleInstance().getCandlesDtoByTime(period, time);
		}
		int page = this.getPageNumByPeriod(period, time);	//得到在哪页
		if(page < 1){
			return null;
		}
		this.pdto = this.getPageDto(period, page);			//根据页数取
		if(null != this.pdto){
			this.hashmap = this.pdto.getMap();
			if(this.hashmap.containsKey(time)){
				return this.hashmap.get(time);
			}
		}
		this.hashmap = null;
		return null;
	}
	
	@SuppressWarnings("static-access")
	final public CandlesDto getCandlesDtoByCno(int period, int cno){
		if(null != Data.fxManager.getMapByPeriod(period)){
			CandlesDto dto = Data.fxManager.getMapByPeriod(period).get(cno);
			if(null != dto){
				return dto;
			}
		}
		
		String time = Data.dBHandler.getTimeByCno(cno, Util.getTabNameByPeriod(period));
		return this.getCandlesDtoByTime(period, Long.parseLong(time));
	}
	
	/**
	 * 根据周期和时间得到是否数据库有值
	 */
	final public boolean isInDBExist(int period, long time){
		CandlesDto dto = this.getCandlesDtoByTime(period, time);
		return null != dto && dto.getPeriod() == period;
	}
}
