package ea.service.res.dto;

import ea.service.utils.base.Mark;

/**
 * 突破信息
 * @author Liang.W.William
 */
public class BreakDto extends DevBrkDto{
	private	boolean		isBreak = false;			//是否突破
	private int 		period;			
	private int 		updn;
	private int 		dir;
	private long 		time	= Mark.No_Time;		//突破时对应分笔顶点的时间
	private int 		ecno;						//突破时对应分笔顶点的编号
	private int 		cno;						//突破时对应周期k线编号
	
	private double 		val;						//突破时的顶点val:用来进场策略比较
	private long 		breakTime = Mark.No_Time;	//突破时间
	private int 		brk_cno;					//突破时M1的CNO
	private double 		breakVal;					//突破时的价格
	
	/**进场参数**/
	private FenBiInfoDto fxDto = null;
	
	public BreakDto(int period){
		this.period = period;
	}

	final public FenBiInfoDto getFxDto() {
		return this.fxDto;
	}
	final public void setFxDto(FenBiInfoDto fxDto) {
		this.fxDto = fxDto;
	}
	final public int getEcno() {
		return this.ecno;
	}
	final public void setEcno(int ecno) {
		this.ecno = ecno;
	}
	final public boolean isBreak() {
		return isBreak;
	}
	final public void setBreak(boolean isBreak) {
		this.isBreak = isBreak;
	}
	final public int getPeriod() {
		return this.period;
	}
	final public void setPeriod(int period) {
		this.period = period;
	}
	final public int getUpdn() {
		return this.updn;
	}
	final public void setUpdn(int updn) {
		this.updn = updn;
	}
	final public int getDir() {
		return this.dir;
	}
	final public void setDir(int dir) {
		this.dir = dir;
	}
	final public long getTime() {
		return this.time;
	}
	final public void setTime(long time) {
		this.time = time;
	}
	final public int getCno() {
		return this.cno;
	}
	final public void setCno(int cno) {
		this.cno = cno;
	}
	final public double getVal() {
		return this.val;
	}
	final public void setVal(double val) {
		this.val = val;
	}
	final public long getBreakTime() {
		return this.breakTime;
	}
	final public void setBreakTime(long breakTime) {
		this.breakTime = breakTime;
	}
	final public int getBrk_cno() {
		return this.brk_cno;
	}
	final public void setBrk_cno(int brk_cno) {
		this.brk_cno = brk_cno;
	}
	final public double getBreakVal() {
		return this.breakVal;
	}
	final public void setBreakVal(double breakVal) {
		this.breakVal = breakVal;
	}
}
