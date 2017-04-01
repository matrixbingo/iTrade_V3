package ea.service.res.dto;

import java.util.ArrayList;

import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;

public class FenBiInfoDto {
	
	private int type = Mark.Fx_Db;								//默认为数据库分笔
	private int period;											//对应的周期
	private int dir;											//第一个点的类型
	private double p1 = 0,p2 = 0,p3 = 0,p4 = 0,p5 = 0,p6 = 0;	//分笔对应的顶点值
	private long t1 = 0,t2 = 0,t3 = 0,t4 = 0,t5 = 0,t6 = 0;		//分笔对应的顶点时间
	private int c1 = 0,c2 = 0,c3 = 0,c4 = 0,c5 = 0,c6 = 0;		//分笔对应的顶点CNO
	private int size;											//分笔的长度
	
	public FenBiInfoDto(int period){
		this.period = period;
	}
	
	final public Object[] getData() {
        Object[][] objs = new Object[2][5];
        objs[0][0] = this.t1;
        objs[0][1] = this.t2;
        objs[0][2] = this.t3;
        objs[0][3] = this.t4;
        objs[0][4] = this.t5;
        
        objs[1][0] = this.dir;
        objs[1][1] = this.dir * -1;
        objs[1][2] = this.dir;
        objs[1][3] = this.dir * -1;
        objs[1][4] = this.dir;
        
        return objs;
    }
	
	final public Object[][] getData(ArrayList<CandlesDto> list, int type) {
		int size = list.size();
		int leng = size;
		Util.sortDesc(list);
        if(type == 0){
        	leng = 4;
        }
        
        Object[][] objs = new Object[2][leng];
        Object[] times = new Object[leng];
        Object[] dirs = new Object[leng];
        
        for(int i = 0; i < leng; i++){
        	times[i] = list.get(i).getTime();
        	dirs[i]	 = list.get(i).getDir();
        }
        objs[0] = times;
        objs[1] = dirs;
        return objs;
    }

	final public void setType(int type) {
		this.type = type;
	}
	final public int getType() {
		return this.type;
	}
	final public int getPeriod() {
		return period;
	}
	final public void setPeriod(int period) {
		this.period = period;
	}
	final public int getDir() {
		return dir;
	}
	final public void setDir(int dir) {
		this.dir = dir;
	}
	final public double getP1() {
		return p1;
	}
	final public void setP1(double p1) {
		this.p1 = p1;
	}
	final public double getP2() {
		return p2;
	}
	final public void setP2(double p2) {
		this.p2 = p2;
	}
	final public double getP3() {
		return p3;
	}
	final public void setP3(double p3) {
		this.p3 = p3;
	}
	final public double getP4() {
		return p4;
	}
	final public void setP4(double p4) {
		this.p4 = p4;
	}
	final public double getP5() {
		return p5;
	}
	final public void setP5(double p5) {
		this.p5 = p5;
	}
	final public double getP6() {
		return p6;
	}
	final public void setP6(double p6) {
		this.p6 = p6;
	}
	final public long getT1() {
		return t1;
	}
	final public void setT1(long t1) {
		this.t1 = t1;
	}
	final public long getT2() {
		return t2;
	}
	final public void setT2(long t2) {
		this.t2 = t2;
	}
	final public long getT3() {
		return t3;
	}
	final public void setT3(long t3) {
		this.t3 = t3;
	}
	final public long getT4() {
		return t4;
	}
	final public void setT4(long t4) {
		this.t4 = t4;
	}
	final public long getT5() {
		return t5;
	}
	final public void setT5(long t5) {
		this.t5 = t5;
	}
	final public long getT6() {
		return t6;
	}
	final public void setT6(long t6) {
		this.t6 = t6;
	}
	final public int getC1() {
		return c1;
	}
	final public void setC1(int c1) {
		this.c1 = c1;
	}
	final public int getC2() {
		return c2;
	}
	final public void setC2(int c2) {
		this.c2 = c2;
	}
	final public int getC3() {
		return c3;
	}
	final public void setC3(int c3) {
		this.c3 = c3;
	}
	final public int getC4() {
		return c4;
	}
	final public void setC4(int c4) {
		this.c4 = c4;
	}
	final public int getC5() {
		return c5;
	}
	final public void setC5(int c5) {
		this.c5 = c5;
	}
	final public int getC6() {
		return c6;
	}
	final public void setC6(int c6) {
		this.c6 = c6;
	}
	final public int getSize() {
		return size;
	}
	final public void setSize(int size) {
		this.size = size;
	}
}
