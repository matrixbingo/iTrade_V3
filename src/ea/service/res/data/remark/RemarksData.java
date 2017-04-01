package ea.service.res.data.remark;

import java.util.LinkedList;
import java.util.Queue;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakDto;
import ea.service.res.dto.DevBrkDto;
import ea.service.utils.base.Mark;

public class RemarksData {
	//--队列:先进先出
	private Queue<String> beilis = null;
	private Queue<String> breaks = null;
	private Queue<String> sectis = null;
	private static RemarksData singleInstance = null; //唯一实例
	private String key = null;
	private StringBuffer sb = null;
	
	public static RemarksData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (RemarksData.class) {
				if (singleInstance == null) {
					singleInstance = new RemarksData();
				}
			}
		}
		return singleInstance;
	}
	
	private RemarksData(){
		this.beilis = new LinkedList<String>();
		this.breaks = new LinkedList<String>();
		this.sectis = new LinkedList<String>();
		this.sb 	= new StringBuffer();
	}
	/**
	 * 设置背离标记:time背离时间，CNO背离分段顶点
	 */
	final public void addDevRemark(BeiliDto dto){
		this.addRemark(Mark.Action_Type_beili, dto);
	}
	/**
	 * 设置突破标记:time突破时间，CNO突破时分笔顶点
	 */
	final public void addBrkRemark(BreakDto dto){
		this.addRemark(Mark.Action_Type_break, dto);
	}
	
	/**
	 * 添加背离标示:不重复访问数据库
	 */
	final private void addRemark(int type, DevBrkDto dto){
		this.sb.setLength(0);
		if(type == Mark.Action_Type_beili){
			this.key = this.sb.append(dto.getPeriod()).append("_").append(dto.getCno()).append("_").append(dto.getUpdn()).append("_").append(dto.getDir()).toString();
			if(beilis.size() == 0){
				beilis.add(this.key);
				this.setRemark(type, dto);
			}else if(beilis.contains(this.key)){
				if(beilis.size() >= 10){
					beilis.remove();
				}
			}else{
				beilis.add(this.key);
				this.setRemark(type, dto);
				if(beilis.size() >= 10){
					beilis.remove();
				}
			}
		}else if(type == Mark.Action_Type_break){
			this.key = this.sb.append(dto.getPeriod()).append("_").append(dto.getEcno()).append("_").append(dto.getUpdn()).append("_").append(dto.getDir()).toString();
			if(breaks.size() == 0){
				breaks.add(this.key);
				this.setRemark(type, dto);
			}else if(breaks.contains(this.key)){
				if(breaks.size() >= 10){
					breaks.remove();
				}
			}else{
				breaks.add(this.key);
				this.setRemark(type, dto);
				if(breaks.size() >= 10){
					breaks.remove();
				}
			}
		}else if(type == Mark.Action_Type_sec){
			if(sectis.size() == 0){
				sectis.add(this.key);
				this.setRemark(type, dto);
			}else if(sectis.contains(this.key)){
				if(sectis.size() >= 10){
					sectis.remove();
				}
			}else{
				sectis.add(this.key);
				this.setRemark(type, dto);
				if(sectis.size() >= 10){
					sectis.remove();
				}
			}
		}
	}
	
	/**
	 * 添加背离标示,存储过程判断已存在相同period，cno，updn，dir则不添加
	 */
	final private void setRemark(int type, DevBrkDto dto){
		switch(type){
			case Mark.Action_Type_beili : Data.exeDataControl.addDevRemark(dto);		//插入
				break;
			case Mark.Action_Type_break : Data.exeDataControl.addBrkRemark(dto);;
				break;
		}
	}
}
