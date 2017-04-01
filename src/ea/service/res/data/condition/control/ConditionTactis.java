package ea.service.res.data.condition.control;

/**
 *	具有排他性的属性，用来确定策略执行具体入口
 */
public class ConditionTactis {
	
	private boolean beili_05_up	= false;
	private boolean beili_05_dn	= false;
	private boolean beili_10_up	= false;
	private boolean beili_10_dn	= false;
	private boolean beili_30_up	= false;
	private boolean beili_30_dn	= false;
	
	private boolean break_10_up	= false;
	private boolean break_10_dn	= false;
	private boolean break_05_up	= false;
	private boolean break_05_dn	= false;
	
	private static ConditionTactis singleInstance = null;
	final public static ConditionTactis getSingleInstance(){
		if (singleInstance == null) {
			synchronized (ConditionTactis.class) {
				if (singleInstance == null) {
					singleInstance = new ConditionTactis();
				}
			}
		}
		return singleInstance;
	}
	
	
	final public boolean isBreak_10_up() {
		return break_10_up;
	}
	final public void setBreak_10_up(boolean break_10_up) {
		this.setBreakFalse();
		this.break_10_up = break_10_up;
	}
	final public boolean isBreak_10_dn() {
		return break_10_dn;
	}
	final public void setBreak_10_dn(boolean break_10_dn) {
		this.setBreakFalse();
		this.break_10_dn = break_10_dn;
	}
	final public boolean isBreak_05_up() {
		return break_05_up;
	}
	final public void setBreak_05_up(boolean break_05_up) {
		this.setBreakFalse();
		this.break_05_up = break_05_up;
	}
	final public boolean isBreak_05_dn() {
		return break_05_dn;
	}
	final public void setBreak_05_dn(boolean break_05_dn) {
		this.setBreakFalse();
		this.break_05_dn = break_05_dn;
	}
	final private void setBreakFalse(){
		this.break_05_up	= false;
		this.break_05_dn	= false;
		this.break_10_up	= false;
		this.break_10_dn	= false;
	}

	/*****************************************************/

	final public boolean isBeili_05_up() {
		return beili_05_up;
	}
	final public void setBeili_05_up(boolean beili_05_up) {
		this.setBeiliFalse();
		this.beili_05_up = beili_05_up;
	}
	final public boolean isBeili_05_dn() {
		return beili_05_dn;
	}
	final public void setBeili_05_dn(boolean beili_05_dn) {
		this.setBeiliFalse();
		this.beili_05_dn = beili_05_dn;
	}
	final public boolean isBeili_10_up() {
		return beili_10_up;
	}
	final public void setBeili_10_up(boolean beili_10_up) {
		this.setBeiliFalse();
		this.beili_10_up = beili_10_up;
	}
	final public boolean isBeili_10_dn() {
		return beili_10_dn;
	}
	final public void setBeili_10_dn(boolean beili_10_dn) {
		this.setBeiliFalse();
		this.beili_10_dn = beili_10_dn;
	}
	final public boolean isBeili_30_up() {
		return beili_30_up;
	}
	final public void setBeili_30_up(boolean beili_30_up) {
		this.setBeiliFalse();
		this.beili_30_up = beili_30_up;
	}
	final public boolean isBeili_30_dn() {
		return beili_30_dn;
	}
	final public void setBeili_30_dn(boolean beili_30_dn) {
		this.setBeiliFalse();
		this.beili_30_dn = beili_30_dn;
	}
	
	final private void setBeiliFalse(){
		this.beili_05_up	= false;
		this.beili_05_dn	= false;
		this.beili_10_up	= false;
		this.beili_10_dn	= false;
		this.beili_30_up	= false;
		this.beili_30_dn	= false;
	}
}
