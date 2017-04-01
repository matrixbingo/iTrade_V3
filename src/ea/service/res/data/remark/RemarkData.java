package ea.service.res.data.remark;

import java.util.LinkedList;
import java.util.Queue;

import ea.server.Data;
import ea.service.utils.base.Mark;

public class RemarkData {
	//--队列:先进先出
	private Queue<String> beilis = null;
	private Queue<String> breaks = null;
	private Queue<String> sectis = null;
	private static RemarkData singleInstance = null; //唯一实例
	
	public static RemarkData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (RemarkData.class) {
				if (singleInstance == null) {
					singleInstance = new RemarkData();
				}
			}
		}
		return singleInstance;
	}
	
	private RemarkData(){
		beilis = new LinkedList<String>();
		breaks = new LinkedList<String>();
		sectis = new LinkedList<String>();
	}
	/**
	 * 添加背离标示:不重复访问数据库
	 */
	public void addRemark(int period, int cno, int type, int dir, String time, double price, int bno){
		String key = period + "_" + cno + "_" + type + "_" + dir;
		if(type == Mark.Action_Type_beili){
			if(beilis.size() == 0){
				beilis.add(key);
				this.setRemark(period, cno, type, dir, time, price, bno);
			}
			if(beilis.contains(key)){
				if(beilis.size() >= 10){
					beilis.remove();
				}
			}else{
				beilis.add(key);
				this.setRemark(period, cno, type, dir, time, price, bno);
				if(beilis.size() >= 10){
					beilis.remove();
				}
			}
		}else if(type == Mark.Action_Type_break){
			if(breaks.size() == 0){
				breaks.add(key);
				this.setRemark(period, cno, type, dir, time, price, bno);
			}
			if(breaks.contains(key)){
				if(breaks.size() >= 10){
					breaks.remove();
				}
			}else{
				breaks.add(key);
				this.setRemark(period, cno, type, dir, time, price, bno);
				if(breaks.size() >= 10){
					breaks.remove();
				}
			}
		}else if(type == Mark.Action_Type_sec){
			if(sectis.size() == 0){
				sectis.add(key);
				this.setRemark(period, cno, type, dir, time, price, bno);
			}
			if(sectis.contains(key)){
				if(sectis.size() >= 10){
					sectis.remove();
				}
			}else{
				sectis.add(key);
				this.setRemark(period, cno, type, dir, time, price, bno);
				if(sectis.size() >= 10){
					sectis.remove();
				}
			}
		}
	}
	
	/**
	 * 添加背离标示,存储过程判断已存在相同period，cno，type，dir则不添加
	 */
	private void setRemark(int period, int cno, int type, int dir, String time, double price, int bno){
		Data.exeDataControl.addRemark(period, cno, type, dir, time, price, bno);		//插入
	}
}
