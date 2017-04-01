package ea.service.res.dto;

/**
 * 月营收数据
 */
public class MonIncDto {
	private String year = null;
	private String mid = "_";
	private int m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12;

	public MonIncDto(Integer year){
		this.year = "'" + year.toString().substring(2, 4);
	}
	public String getMonInc(int num){
	/*	StringBuffer rs = new StringBuffer();
		for(int i=1; i<=num; i++){
			rs.append(arg0)
		}*/
		return this.m01 + ", " + this.m02 + ", " + this.m03 + ", " + this.m04 + ", " + this.m05 + ", " + this.m06 + ", " + this.m07 + ", " + this.m08 + ", " + this.m09 + ", " + this.m10 + ", " + this.m11 + ", " + this.m12;
	}
	public String getTimes(){
		return year + this.mid + "01' , " + year + this.mid + "02' , " + year + this.mid + "03' , "+ year + this.mid + "04' , "+ year + this.mid + "05' , "+ year + this.mid + "06' , "+ year + this.mid + "07' , "+ year + this.mid + "08' , "+ year + this.mid + "09' , "+ year + this.mid + "10' , "+ year + this.mid + "11' , "+ year + this.mid + "12'";
	}
	public int getM01() {
		return m01;
	}

	public void setM01(int m01) {
		this.m01 = m01;
	}

	public int getM02() {
		return m02;
	}

	public void setM02(int m02) {
		this.m02 = m02;
	}

	public int getM03() {
		return m03;
	}

	public void setM03(int m03) {
		this.m03 = m03;
	}

	public int getM04() {
		return m04;
	}

	public void setM04(int m04) {
		this.m04 = m04;
	}

	public int getM05() {
		return m05;
	}

	public void setM05(int m05) {
		this.m05 = m05;
	}

	public int getM06() {
		return m06;
	}

	public void setM06(int m06) {
		this.m06 = m06;
	}

	public int getM07() {
		return m07;
	}

	public void setM07(int m07) {
		this.m07 = m07;
	}

	public int getM08() {
		return m08;
	}

	public void setM08(int m08) {
		this.m08 = m08;
	}

	public int getM09() {
		return m09;
	}

	public void setM09(int m09) {
		this.m09 = m09;
	}

	public int getM10() {
		return m10;
	}

	public void setM10(int m10) {
		this.m10 = m10;
	}

	public int getM11() {
		return m11;
	}

	public void setM11(int m11) {
		this.m11 = m11;
	}

	public int getM12() {
		return m12;
	}

	public void setM12(int m12) {
		this.m12 = m12;
	}
	
	
}
