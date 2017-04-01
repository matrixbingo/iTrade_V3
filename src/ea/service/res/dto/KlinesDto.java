package ea.service.res.dto;

import ea.service.utils.base.Mark;

/**
 * k线数据
 * @author Liang.W.William
 */
public class KlinesDto {
	
	private int		period 	= Mark.No_Period;
	private int		cno		= Mark.No_Cno;		//编号
	private long 	time 	= Mark.No_Time;
	private double 	open;
	private double 	close;
	private double 	high;
	private double 	low;
	private double	bar;
	
	//--- Fx参数
	private int dir;
	private int type;
	
	//--- KD指标
	private double 	k;
	private double 	d;
	
	/**
	 * 取极点值
	 */
	final public double getFxPole(){
		return this.dir == Mark.From_Btm ? this.low : this.high; 
	}
	
	final public double getBar() {
		return this.bar;
	}

	final public void setBar(double bar) {
		this.bar = bar;
	}

	final public int getPeriod() {
		return this.period;
	}
	final public void setPeriod(int period) {
		this.period = period;
	}
	final public int getCno() {
		return this.cno;
	}
	final public void setCno(int cno) {
		this.cno = cno;
	}
	final public long getTime() {
		return this.time;
	}
	final public void setTime(long time) {
		this.time = time;
	}
	final public void setTime(String time) {
		this.time = Long.valueOf(time);
	}
	final public double getOpen() {
		return this.open;
	}
	final public void setOpen(double open) {
		this.open = open;
	}
	final public double getClose() {
		return this.close;
	}
	final public void setClose(double close) {
		this.close = close;
	}
	final public double getHigh() {
		return this.high;
	}
	final public void setHigh(double high) {
		this.high = high;
	}
	final public double getLow() {
		return this.low;
	}
	final public void setLow(double low) {
		this.low = low;
	}
	final public int getDir() {
		return this.dir;
	}
	final public void setDir(int dir) {
		this.dir = dir;
	}
	final public int getType() {
		return this.type;
	}
	final public void setType(int type) {
		this.type = type;
	}
	final public double getK() {
		return k;
	}
	final public void setK(double k) {
		this.k = k;
	}
	final public double getD() {
		return d;
	}
	final public void setD(double d) {
		this.d = d;
	}
}
