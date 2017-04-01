package ea.service.res.dto;

public class FxMod {
	private int cno, topbtm;
	private long time;
	private double price;
	
	final public int getCno() {
		return cno;
	}
	final public void setCno(int cno) {
		this.cno = cno;
	}
	final public int getTopbtm() {
		return topbtm;
	}
	final public void setTopbtm(int topbtm) {
		this.topbtm = topbtm;
	}
	final public long getTime() {
		return time;
	}
	final public void setTime(long time) {
		this.time = time;
	}
	final public double getPrice() {
		return price;
	}
	final public void setPrice(double price) {
		this.price = price;
	}
}
