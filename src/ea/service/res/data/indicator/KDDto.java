package ea.service.res.data.indicator;

import ea.service.utils.base.Mark;


public class KDDto {

	private int		period 	= Mark.No_Period;
	private int		cno		= Mark.No_Cno;		//编号
	private long 	time 	= Mark.No_Time;
	private double 	k;
	private double 	d;

    public int getPeriod() {
		return period;
	}

	public void setPeriod(int period) {
		this.period = period;
	}

	public int getCno() {
		return cno;
	}

	public void setCno(int cno) {
		this.cno = cno;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

	public double getK() {
		return k;
	}

	public void setK(double k) {
		this.k = k;
	}

	public double getD() {
		return d;
	}

	public void setD(double d) {
		this.d = d;
	}

	public String toString() {
        return "\r\n period:" + period + "\r\n cno:" + cno + "\r\n time:" + time + "\r\n k:" + k + "\r\n d:" + d;
    }
}
