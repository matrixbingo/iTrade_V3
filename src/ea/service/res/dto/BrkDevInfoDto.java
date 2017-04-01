package ea.service.res.dto;

/**
 * 背离突破数据:显示
 */
public class BrkDevInfoDto {
	private long time;
	private int updn;
	private int type;
	private String name;
	
	final public long getTime() {
		return time;
	}
	final public void setTime(long time) {
		this.time = time;
	}
	final public int getUpdn() {
		return updn;
	}
	final public void setUpdn(int updn) {
		this.updn = updn;
	}
	final public int getType() {
		return type;
	}
	final public void setType(int type) {
		this.type = type;
	}
	final public String getName() {
		return name;
	}
	final public void setName(String name) {
		this.name = name;
	}
}
