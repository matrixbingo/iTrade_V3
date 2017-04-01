package ea.service.res.dto;

import java.util.HashMap;

import ea.service.utils.base.Mark;

public class PageDto {
	private int page;	//当前是哪页
	private int period;
	private long bin = Mark.No_Time;
	private long end = Mark.No_Time;
	private HashMap<Long, CandlesDto> map = null;	//每页对应的时间：k线数据
	
	final public int getPage() {
		return this.page;
	}
	final public void setPage(int page) {
		this.page = page;
	}
	final public int getPeriod() {
		return this.period;
	}
	final public void setPeriod(int period) {
		this.period = period;
	}
	final public long getBin() {
		return this.bin;
	}
	final public void setBin(long bin) {
		this.bin = bin;
	}
	final public long getEnd() {
		return this.end;
	}
	final public void setEnd(long end) {
		this.end = end;
	}
	final public HashMap<Long, CandlesDto> getMap() {
		return this.map;
	}
	final public void setMap(HashMap<Long, CandlesDto> map) {
		this.map = map;
	}
}
