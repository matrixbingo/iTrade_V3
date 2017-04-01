package ea.service.res.dto;

public class InMarketDto {

	private int version;
	private int dir;
	private int type;
	
	private BeiliDto dto_dvt_30 = null;
	private	BeiliDto dto_dvt_10 = null;
	private	BeiliDto dto_dvt_05 = null;
	
	private int state = 0; //0:未进场 1：已进场
	
	public InMarketDto(int version, int dir, int type){
		this.version = version;
		this.type 	 = type;
		this.dir 	 = dir;
	}
	
	
	final public int getState() {
		return this.state;
	}
	final public void setState(int state) {
		this.state = state;
	}


	final public int getType() {
		return this.type;
	}

	final public void setUpdn(int type) {
		this.type = type;
	}

	final public int getDir() {
		return dir;
	}

	final public void setDir(int dir) {
		this.dir = dir;
	}

	final public int getVersion() {
		return this.version;
	}
	final public void setVersion(int version) {
		this.version = version;
	}
	final public BeiliDto getDto_dvt_30() {
		return this.dto_dvt_30;
	}
	final public void setDto_dvt_30(BeiliDto dto_dvt_30) {
		this.dto_dvt_30 = dto_dvt_30;
	}
	final public BeiliDto getDto_dvt_10() {
		return this.dto_dvt_10;
	}
	final public void setDto_dvt_10(BeiliDto dto_dvt_10) {
		this.dto_dvt_10 = dto_dvt_10;
	}
	final public BeiliDto getDto_dvt_05() {
		return this.dto_dvt_05;
	}
	final public void setDto_dvt_05(BeiliDto dto_dvt_05) {
		this.dto_dvt_05 = dto_dvt_05;
	}
	
	
}
