package ea.service.res.dto;

import ea.service.utils.base.Mark;
import ea.service.utils.comm.Maths;

public final class BaseDto {
	private int type = 1;	//fx时  0:无返回值 1：默认有
	
	private Integer num = Mark.No_Cno;
	
	private int period;
	private int cno;
	private int dir;
	private int updn;
	private long time = Mark.No_Time;
	
	private long bin = Mark.No_Time;
	private long end = Mark.No_Time;
	
	//MCAD 和 FX
	private int row;
	private double max, min;
	private int q0;
	private double q1,q2,q3,q4,q5,q6;	//分笔对应信息

	//收益数据
	private double sum;
	int mon, total;
	
	
	public double getSum() {
		return sum;
	}
	public void setSum(double sum) {
		this.sum = Maths.priceToIntFour(sum);
	}
	public int getMon() {
		return mon;
	}
	public void setMon(int mon) {
		this.mon = mon;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	final public int getType() {
		return this.type;
	}
	final public void setType(int type) {
		this.type = type;
	}
	final public int getRow() {
		return this.row;
	}
	final public void setRow(int row) {
		this.row = row;
	}
	final public double getMax() {
		return this.max;
	}
	final public void setMax(double max) {
		this.max = max;
	}
	final public double getMin() {
		return this.min;
	}
	final public void setMin(double min) {
		this.min = min;
	}
	final public int getQ0() {
		return this.q0;
	}
	final public void setQ0(int q0) {
		this.q0 = q0;
	}
	final public double getQ1() {
		return this.q1;
	}
	final public void setQ1(double q1) {
		this.q1 = q1;
	}
	final public double getQ2() {
		return this.q2;
	}
	final public void setQ2(double q2) {
		this.q2 = q2;
	}
	final public double getQ3() {
		return this.q3;
	}
	final public void setQ3(double q3) {
		this.q3 = q3;
	}
	final public double getQ4() {
		return this.q4;
	}
	final public void setQ4(double q4) {
		this.q4 = q4;
	}
	final public double getQ5() {
		return this.q5;
	}
	final public void setQ5(double q5) {
		this.q5 = q5;
	}
	final public double getQ6() {
		return this.q6;
	}
	final public void setQ6(double q6) {
		this.q6 = q6;
	}
	final public Integer getNum() {
		return this.num;
	}
	final public void setNum(Integer num) {
		this.num = num;
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
	final public int getDir() {
		return this.dir;
	}
	final public void setDir(int dir) {
		this.dir = dir;
	}
	final public int getUpdn() {
		return this.updn;
	}
	final public void setUpdn(int updn) {
		this.updn = updn;
	}
	final public long getTime() {
		return this.time;
	}
	final public void setTime(long time) {
		this.time = time;
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
}
