package ea.service.res.dto;

import java.util.ArrayList;

import ea.service.utils.base.Mark;

public final class BeiliDto extends DevBrkDto {
	
	private boolean 	isBeili = false;
	
	private int 		period;
	private int 		updn	= Mark.Beili_No;	
	private int 		cno 	= Mark.No_Cno;		//背离时对应分笔顶点的编号
	private double 		price 	= Mark.No_Price_Min;
	private long 		time 	= Mark.No_Time;		//背离点的时间
	private int 		dev_cno;					//背离点的M1的CNO
	
	/**测试参数**/
	private int 		dir		= 0;				//Mark.Action_Dir_Top_1 等
	private int			kdif1	= 0;
	private int			kdif2	= 0;
	private int			ang1	= 0;
	private int			ang2	= 0;
	private int			ang3	= 0;
	private int			md1		= 0;
	private int			md2		= 0;
	private String      cnos	= "";
	private ArrayList<Integer>	cnoes   = new ArrayList<Integer>();
	
	/**进场参数**/
	private FenBiInfoDto fxDto = null;
	
	public BeiliDto(int period){
		this.period = period;
	}
	
	final public ArrayList<Integer> getCnoes() {
		String[] cnos = this.cnos.split("-");
		this.cnoes.add(0, Integer.valueOf(cnos[0]));
		this.cnoes.add(1, Integer.valueOf(cnos[1]));
		this.cnoes.add(2, Integer.valueOf(cnos[2]));
		this.cnoes.add(3, Integer.valueOf(cnos[3]));
		return this.cnoes;
	}
	final public void setCnos(String cnos) {
		this.cnos = cnos;
	}
	final public String getCnos() {
		return this.cnos;
	}
	final public FenBiInfoDto getFxDto() {
		return this.fxDto;
	}
	final public void setFxDto(FenBiInfoDto fxDto) {
		if(null != fxDto){
			this.cnos = new StringBuffer().append(fxDto.getC1()).append("-").append(fxDto.getC2()).append("-").append(fxDto.getC3()).append("-").append(fxDto.getC4()).toString();
		}
		this.fxDto = fxDto;
	}
	final public boolean isBeili() {
		return isBeili;
	}
	final public void setBeili(boolean isBeili) {
		this.isBeili = isBeili;
	}
	final public int getPeriod() {
		return period;
	}
	final public void setPeriod(int period) {
		this.period = period;
	}
	final public int getUpdn() {
		return updn;
	}
	final public void setUpdn(int updn) {
		this.updn = updn;
	}
	final public int getCno() {
		return cno;
	}
	final public void setCno(int cno) {
		this.cno = cno;
	}
	final public double getPrice() {
		return price;
	}
	final public void setPrice(double price) {
		this.price = price;
	}
	final public long getTime() {
		return time;
	}
	final public void setTime(long time) {
		this.time = time;
	}
	final public int getDev_cno() {
		return dev_cno;
	}
	final public void setDev_cno(int dev_cno) {
		this.dev_cno = dev_cno;
	}
	final public int getDir() {
		return dir;
	}
	final public void setDir(int dir) {
		this.dir = dir;
	}
	final public int getKdif1() {
		return kdif1;
	}
	final public void setKdif1(int kdif1) {
		this.kdif1 = kdif1;
	}
	final public int getKdif2() {
		return kdif2;
	}
	final public void setKdif2(int kdif2) {
		this.kdif2 = kdif2;
	}
	final public int getAng1() {
		return ang1;
	}
	final public void setAng1(int ang1) {
		this.ang1 = ang1;
	}
	final public int getAng2() {
		return ang2;
	}
	final public void setAng2(int ang2) {
		this.ang2 = ang2;
	}
	final public int getAng3() {
		return ang3;
	}
	final public void setAng3(int ang3) {
		this.ang3 = ang3;
	}
	final public int getMd1() {
		return md1;
	}
	final public void setMd1(int md1) {
		this.md1 = md1;
	}
	final public int getMd2() {
		return md2;
	}
	final public void setMd2(int md2) {
		this.md2 = md2;
	}
}
