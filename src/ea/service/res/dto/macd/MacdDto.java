package ea.service.res.dto.macd;


public class MacdDto {
	private MacdPointDto mh;
	private MacdPointDto ml;
	
	final public MacdPointDto getMh() {
		return this.mh;
	}
	final public void setMh(MacdPointDto mh) {
		this.mh = mh;
	}
	final public MacdPointDto getMl() {
		return this.ml;
	}
	final public void setMl(MacdPointDto ml) {
		this.ml = ml;
	}
}
