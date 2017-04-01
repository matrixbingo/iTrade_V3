package ea.service.res.data.page.control;

import java.util.HashMap;

import ea.service.res.dto.BaseDto;
import ea.service.res.dto.PageDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;

public abstract class PageServer {
	private final int page_no_ex = 200;	//分页时往前200根
	protected int 		page_no	 = 0;	//不存在的页数
	protected int		page_m01 = page_no,	page_m05 = page_no, page_m10 = page_no, page_m30 = page_no, page_h01 = page_no, page_h04 = page_no;	//各个周期当前在哪页
	protected PageDto 	dto_m01  = null,	 dto_m05 = null,     dto_m10 = null,     dto_m30 = null,     dto_h01 = null,     dto_h04 = null;	//各个周期的dto
	protected PageDto pdto = null;
	protected BaseDto dto = null;
	
	protected int 	max_m01 = 0, 	max_m05 = 0,	max_m10 = 0, 	max_m30 = 0,	max_h01 = 0, 	max_h04 = 0;	//各个周期最大页数
	protected HashMap<Integer, BaseDto> num_map_m01 = null, num_map_m05 = null,	num_map_m10 = null;					//各周期页数：每页起始结束行，0：全部起始结束行
	protected HashMap<Integer, BaseDto> num_map_m30 = null, num_map_h01 = null, num_map_h04 = null;
	protected HashMap<Integer, BaseDto> map = null;
		
	public void clearAll(){
		this.page_m01 = this.page_no;	this.page_m05 = this.page_no; this.page_m10 = this.page_no; this.page_m30 = this.page_no; this.page_h01 = this.page_no; this.page_h04 = this.page_no;
		this.dto_m01  = null;	 this.dto_m05 = null;     this.dto_m10 = null;     this.dto_m30 = null;     this.dto_h01 = null;     this.dto_h04 = null;
		this.pdto = null;
		this.dto = null;
		
		this.max_m01 = 0; 	this.max_m05 = 0;	this.max_m10 = 0; 	this.max_m30 = 0;	this.max_h01 = 0; 	this.max_h04 = 0;
		this.num_map_m01 = null; this.num_map_m05 = null;	this.num_map_m10 = null;
		this.num_map_m30 = null; this.num_map_h01 = null; this.num_map_h04 = null;
		this.map = null;
	}
	
	public String getSql(int period, int start, int end){
		String sql = new StringBuffer("select t1.time, t1.cno, t1.open, t1.close, t1.high, t1.low, t2.bar from ")
					.append(Util.getTabNameByPeriod(period)).append(" t1 ")
					.append("left join t_macd t2 on t2.period=")
					.append(period).append(" and t1.cno = t2.cno ")
					.append("where t1.cno > ")
					.append(start - this.page_no_ex)
					.append(" and t1.cno <= ")
					.append(end)
					.append(" order by t1.cno asc;")
					.toString();

		System.out.println("period : " + period + " start : " + start + " end : " + end + " sql --> " + sql);
		return sql;
	}

	public static String getSql(int period, int start, int end, boolean useMacd) {
		if (useMacd) {
			return new StringBuffer("select t1.time, t1.cno, t1.open, t1.close, t1.high, t1.low, t2.bar from ")
					.append(ea.service.utils.comm.Util.getTabNameByPeriod(period)).append(" t1 ")
					.append("left join t_macd t2 on t2.period=")
					.append(period).append(" and t1.cno = t2.cno ")
					.append("where t1.cno > ")
					.append(start - 200)
					.append(" and t1.cno <= ")
					.append(end)
					.append(" order by t1.cno asc;")
					.toString();
		} else {
			return new StringBuilder("select t1.time, t1.cno, t1.open, t1.close, t1.high, t1.low, 0 as bar from ")
					.append(ea.service.utils.comm.Util.getTabNameByPeriod(period)).append(" t1 ")
					.append("where t1.cno > ")
					.append(start - 200)
					.append(" and t1.cno <= ")
					.append(end)
					.append(" order by t1.cno asc;")
					.toString();
		}
	}


	protected boolean isCurrPage(int period, int page){
		if(page == this.page_no){
			return false;
		}
		switch(period){
			case Mark.Period_M01 : if(this.page_m01 == page) return true;
				break;
			case Mark.Period_M05 : if(this.page_m05 == page) return true;
				break;
			case Mark.Period_M10 : if(this.page_m10 == page) return true;
				break;
			case Mark.Period_M30 : if(this.page_m30 == page) return true;
				break;
			case Mark.Period_H01 : if(this.page_h01 == page) return true;
				break;
			case Mark.Period_H04 : if(this.page_h04 == page) return true;
			break;
		}
		return false;
	}
	protected boolean isTimeBetweenClose(int period, long time){
		if(time == Mark.No_Time){
			return false;
		}
		switch(period){
			case Mark.Period_M01 : return Util.isTimeBetweenClose(time, this.dto_m01.getBin(), this.dto_m01.getEnd());
			case Mark.Period_M05 : return Util.isTimeBetweenClose(time, this.dto_m05.getBin(), this.dto_m05.getEnd());
			case Mark.Period_M10 : return Util.isTimeBetweenClose(time, this.dto_m10.getBin(), this.dto_m10.getEnd());
			case Mark.Period_M30 : return Util.isTimeBetweenClose(time, this.dto_m30.getBin(), this.dto_m30.getEnd());
			case Mark.Period_H01 : return Util.isTimeBetweenClose(time, this.dto_h01.getBin(), this.dto_h01.getEnd());
			case Mark.Period_H04 : return Util.isTimeBetweenClose(time, this.dto_h04.getBin(), this.dto_h04.getEnd());
		}
		return false;
	}
	protected PageDto getCurrPageDto(int period){
		switch(period){
			case Mark.Period_M01 : return this.dto_m01;
			case Mark.Period_M05 : return this.dto_m05;
			case Mark.Period_M10 : return this.dto_m10;
			case Mark.Period_M30 : return this.dto_m30;
			case Mark.Period_H01 : return this.dto_h01;
			case Mark.Period_H04 : return this.dto_h04;
		}
		return null;
	}
	protected int getCurrPage(int period){
		switch(period){
			case Mark.Period_M01 : return this.page_m01;
			case Mark.Period_M05 : return this.page_m05;
			case Mark.Period_M10 : return this.page_m10;
			case Mark.Period_M30 : return this.page_m30;
			case Mark.Period_H01 : return this.page_h01;
			case Mark.Period_H04 : return this.page_h04;
		}
		return this.page_no;
	}
	public void initCurrPageInfo(int period, int page, PageDto pdto){
		switch(period){
			case Mark.Period_M01 : 	this.page_m01 = page; this.dto_m01 = pdto;		
				break;
			case Mark.Period_M05 : 	this.page_m05 = page; this.dto_m05 = pdto;
				break;
			case Mark.Period_M10 : 	this.page_m10 = page; this.dto_m10 = pdto;				
				break;
			case Mark.Period_M30 : 	this.page_m30 = page; this.dto_m30 = pdto;
				break;
			case Mark.Period_H01 : 	this.page_h01 = page; this.dto_h01 = pdto;
				break;
			case Mark.Period_H04 : 	this.page_h04 = page; this.dto_h04 = pdto;
				break;
		}
	}

	public void initNumMap(int period, HashMap<Integer, BaseDto> map){
		switch(period){
			case Mark.Period_M01 : this.num_map_m01 = map;
				break;
			case Mark.Period_M05 : this.num_map_m05 = map;
				break;
			case Mark.Period_M10 : this.num_map_m10 = map;
				break;
			case Mark.Period_M30 : this.num_map_m30 = map;
				break;
			case Mark.Period_H01 : this.num_map_h01 = map;
				break;
			case Mark.Period_H04 : this.num_map_h04 = map;
				break;
		}
	}
	
	public PageDto getPageTime(int period, int page){
		System.out.println(this + "  ：  getPageTime");
		this.pdto = new PageDto();
		switch(period){
			case Mark.Period_M01 : dto = this.num_map_m01.get(page);	
				break;
			case Mark.Period_M05 : dto = this.num_map_m05.get(page);
				break;
			case Mark.Period_M10 : dto = this.num_map_m10.get(page);
				break;
			case Mark.Period_M30 : dto = this.num_map_m30.get(page);
				break;
			case Mark.Period_H01 : dto = this.num_map_h01.get(page);
				break;
			case Mark.Period_H04 : dto = this.num_map_h04.get(page);
				break;
		}
		this.pdto.setBin(this.dto.getBin());
		this.pdto.setEnd(this.dto.getEnd());
		return this.pdto;
	}
}
