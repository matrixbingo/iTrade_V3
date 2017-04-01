package ea.service.res.dto;

import ea.service.utils.base.Mark;
 
public class OrderDto {
	//-- 进场数据
	private int version			= 0;	//策略版本号,必填项
	private int ecno			= 0;	// 存最近一个5分钟cno
	private int type			= 0;	// 必填项
	private int icno 			= 0;	// 存一分钟 cno
	private int dir  			= 0;	// 必填项 1: 多 -1:空
	private int state 			= Mark.Order_state_ing;	
	private int in_dvt05		= 0;
	private int in_dvt10		= 0;
	private int in_dvt30		= 0;
	private int in_brk05_dvt	= 0;
	private int in_brk10_dvt	= 0;
	private int topbtm			= 0;
	private double in_price		= 0;
	private long in_time		= 0;
	//-- 出场数据
	private int ot_dvt05		= 0;
	private int ot_dvt10		= 0;
	private int ocno 			= 0;
	private double ot_price		= 0;
	private long ot_time		= 0;
	
	//-- 非存储数据
	private int dev_period		= 0;	//用来限定取有效dvt的周期
	private int dev_in_dvt		= 0;
	private boolean isMove		= true;	//默认使用移动出场
	
	public OrderDto(){}
	
	public OrderDto(int version){
		this.version = version;
	}
	final public void setDev_period(int dev_period) {
		this.dev_period = dev_period;
	}
	final public int getDev_in_dvt() {
		switch(this.dev_period){
			case  Mark.Period_M05 	: return this.in_dvt05;
			case  Mark.Period_M10 	: return this.in_dvt10;
			case  Mark.Period_M30 	: return this.in_dvt30;
		}
		return this.dev_in_dvt;
	}
	final public int getDev_id_dvt() {
		switch(this.dev_period){
			case  Mark.Period_M05 	: return Integer.valueOf(new StringBuffer().append(50).append(this.in_dvt05).toString());
			case  Mark.Period_M10 	: return Integer.valueOf(new StringBuffer().append(10).append(this.in_dvt10).toString());
			case  Mark.Period_M30 	: return Integer.valueOf(new StringBuffer().append(30).append(this.in_dvt30).toString());
		}
		return this.dev_in_dvt;
	}
	
	final public String getKey(){
		return new StringBuffer().append(this.version).append("_").append(this.dir).append("_").append(this.type).append("_").append(this.ecno).toString();
	}
	
	final public int getVersion() {
		return this.version;
	}
	final public void setVersion(int version) {
		this.version = version;
	}
	final public boolean isMove() {
		return this.isMove;
	}
	final public void setMove(boolean isMove) {
		this.isMove = isMove;
	}
	final public long getIn_time() {
		return this.in_time;
	}
	final public void setIn_time(long in_time) {
		this.in_time = in_time;
	}
	final public long getOt_time() {
		return this.ot_time;
	}
	final public void setOt_time(long ot_time) {
		this.ot_time = ot_time;
	}
	final public double getIn_price() {
		return this.in_price;
	}
	final public void setIn_price(double in_price) {
		this.in_price = in_price;
	}
	final public double getOt_price() {
		return this.ot_price;
	}
	final public void setOt_price(double ot_price) {
		this.ot_price = ot_price;
	}
	final public int getEcno() {
		return ecno;
	}
	final public void setEcno(int ecno) {
		this.ecno = ecno;
	}
	final public int getType() {
		return type;
	}
	final public void setType(int type) {
		this.type = type;
	}
	final public int getIcno() {
		return icno;
	}
	final public void setIcno(int icno) {
		this.icno = icno;
	}
	final public int getOcno() {
		return ocno;
	}
	final public void setOcno(int ocno) {
		this.ocno = ocno;
	}
	final public int getDir() {
		return dir;
	}
	final public void setDir(int dir) {
		this.dir = dir;
	}
	final public int getState() {
		return state;
	}
	final public void setState(int state) {
		this.state = state;
	}
	final public int getIn_dvt05() {
		return in_dvt05;
	}
	final public void setIn_dvt05(int in_dvt05) {
		this.in_dvt05 = in_dvt05;
	}
	final public int getIn_dvt10() {
		return in_dvt10;
	}
	final public void setIn_dvt10(int in_dvt10) {
		this.in_dvt10 = in_dvt10;
	}
	final public int getIn_dvt30() {
		return this.in_dvt30;
	}
	final public void setIn_dvt30(int in_dvt30) {
		this.in_dvt30 = in_dvt30;
	}
	final public int getIn_brk05_dvt() {
		return in_brk05_dvt;
	}
	final public void setIn_brk05_dvt(int in_brk05_dvt) {
		this.in_brk05_dvt = in_brk05_dvt;
	}
	final public int getIn_brk10_dvt() {
		return in_brk10_dvt;
	}
	final public void setIn_brk10_dvt(int in_brk10_dvt) {
		this.in_brk10_dvt = in_brk10_dvt;
	}
	final public int getOt_dvt05() {
		return ot_dvt05;
	}
	final public void setOt_dvt05(int ot_dvt05) {
		this.ot_dvt05 = ot_dvt05;
	}
	final public int getOt_dvt10() {
		return ot_dvt10;
	}
	final public void setOt_dvt10(int ot_dvt10) {
		this.ot_dvt10 = ot_dvt10;
	}
	final public int getTopbtm() {
		return topbtm;
	}
	final public void setTopbtm(int topbtm) {
		this.topbtm = topbtm;
	}
}
