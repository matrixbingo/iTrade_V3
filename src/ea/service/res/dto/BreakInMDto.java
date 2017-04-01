package ea.service.res.dto;

public class BreakInMDto {
	private int version, dir, type, period;
	private double up = 0, dn = 0;
	private FenBiInfoDto up_fxDto = null, dn_fxDto = null;
	private boolean state = true;
	
	//-- 进场数据 必填
	private int In_dvt05 = 0, In_dvt10 = 0, In_dvt30 = 0;
	private int In_brk05 = 0, In_brk10 = 0, In_brk30 = 0;
	
	public BreakInMDto(int version, int dir, int type, int period){
		this.version = version;
		this.dir	 = dir;
		this.type	 = type;
		this.period	 = period;
	}
	
	final public boolean getState() {
		return this.state;
	}
	final public void setState(boolean state) {
		this.state = state;
	}
	final public double getUp() {
		return up;
	}
	final public void setUp(double up) {
		this.up = up;
	}
	final public double getDn() {
		return dn;
	}
	final public void setDn(double dn) {
		this.dn = dn;
	}
	final public FenBiInfoDto getUp_fxDto() {
		return up_fxDto;
	}
	final public void setUp_fxDto(FenBiInfoDto up_fxDto) {
		this.up_fxDto = up_fxDto;
	}
	final public FenBiInfoDto getDn_fxDto() {
		return dn_fxDto;
	}
	final public void setDn_fxDto(FenBiInfoDto dn_fxDto) {
		this.dn_fxDto = dn_fxDto;
	}
	final public int getPeriod() {
		return period;
	}
	final public int getVersion() {
		return version;
	}
	final public int getDir() {
		return dir;
	}
	final public int getType() {
		return this.type;
	}
	final public int getIn_dvt05() {
		return In_dvt05;
	}
	final public void setIn_dvt05(int in_dvt05) {
		In_dvt05 = in_dvt05;
	}
	final public int getIn_dvt10() {
		return In_dvt10;
	}
	final public void setIn_dvt10(int in_dvt10) {
		In_dvt10 = in_dvt10;
	}
	final public int getIn_dvt30() {
		return In_dvt30;
	}
	final public void setIn_dvt30(int in_dvt30) {
		In_dvt30 = in_dvt30;
	}
	final public int getIn_brk05() {
		return In_brk05;
	}
	final public void setIn_brk05(int in_brk05) {
		In_brk05 = in_brk05;
	}
	final public int getIn_brk10() {
		return In_brk10;
	}
	final public void setIn_brk10(int in_brk10) {
		In_brk10 = in_brk10;
	}
	final public int getIn_brk30() {
		return In_brk30;
	}
	final public void setIn_brk30(int in_brk30) {
		In_brk30 = in_brk30;
	}
}
