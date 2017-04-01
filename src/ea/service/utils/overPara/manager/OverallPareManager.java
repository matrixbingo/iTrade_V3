package ea.service.utils.overPara.manager;

import java.util.HashMap;
import java.util.LinkedList;

import ea.service.utils.base.Mark;
import ea.service.utils.overPara.help.OverMark;
import ea.service.utils.overPara.help.OverallPareServer;
/**
 * 全局变量管理
 * @author WL
 * @date 2012-11-16 下午1:24:46
 */
public class OverallPareManager extends OverallPareServer {
	public static String remark = "remark";
	public static String common = "common";
	private static OverallPareManager singleInstance = null;
	private static HashMap<String,OverallPareManager> instances = null;
	private String name = null;
	
	public static OverallPareManager getSingleInstance(){
		return OverallPareManager.getSingleInstance(OverallPareManager.common);
	}
	
	public static OverallPareManager getSingleInstance(String name){
		if(instances == null){
			instances = new HashMap<String,OverallPareManager>();
		}
		singleInstance = instances.get(name);
		if(singleInstance !=null && singleInstance instanceof OverallPareManager){
			return singleInstance;
		}else{
			singleInstance = new OverallPareManager(name);
			instances.put(name, singleInstance);
		}
		return singleInstance;
	}
	
	private OverallPareManager(String name){
		this.name = name;
	}
	/**
	 * 设置退出系统
	 */
	public void setOutSysFlag(boolean bool){
		super.setPara(OverMark.RunSysFlag, bool);
	}
	/**
	 * 是否退出系统
	 */
	public boolean isOutSysFlag(){
		return super.getBoolean(OverMark.RunSysFlag);
	}
	/**
	 * version
	 */
	public void setVersion(int tVersion){
		super.setPara(OverMark.Version, tVersion);
	}
	public Integer getVersion(){
		Integer in = super.getInteger(OverMark.Version);
		if(null == in){
			return Mark.Version_v01;
		}
		return in;
	}
	/**
	 * 策略版本
	 */
	public void setTacticsVsion(int tVersion){
		super.setPara(OverMark.TacticsVsion, tVersion);
	}
	public Integer getTacticsVsion(){
		return super.getInteger(OverMark.TacticsVsion);
	}
	
	/**
	 * V4 进场点id存储
	 * @param dto
	 */
	public void addVsion4Ids(int type, int id){
		switch(type){
			case Mark.Action_Type_Sell : super.addPara(OverMark.V4iMId_sel, id);
				break;
			case Mark.Action_Type_Buy  : super.addPara(OverMark.V4iMId_buy, id);
				break;
		}
	}
	
	public Object getVsion4Ids(int type){
		switch(type){
			case Mark.Action_Type_Sell : return super.getObject(OverMark.V4iMId_sel);
			case Mark.Action_Type_Buy  : return super.getObject(OverMark.V4iMId_buy);
		}
		return null;
	}
	@SuppressWarnings("rawtypes")
	public void removeVsion4Id(int type, int id){
		Object ids = this.getVsion4Ids(type);
		if(ids instanceof LinkedList){
			LinkedList list = (LinkedList) ids;
			int len= list.size();
			for(int i = 0; i<len; ++i){
				  if((Integer)list.get(i) == id){
					  list.remove(i);
				      --len;
				  }
			}
			switch(type){
				case Mark.Action_Type_Sell : super.remove(OverMark.V4iMId_sel); super.addPara(OverMark.V4iMId_sel, list);
				case Mark.Action_Type_Buy  : super.remove(OverMark.V4iMId_buy); super.addPara(OverMark.V4iMId_buy, list);
			}
		}else if(ids != null && !(ids instanceof LinkedList)){
			boolean bool = (Integer)ids == id;
			switch(type){
				case Mark.Action_Type_Sell : if(bool)super.remove(OverMark.V4iMId_sel);
				case Mark.Action_Type_Buy  : if(bool)super.remove(OverMark.V4iMId_buy);
			}
		}
	}
	
	/**
	 * V4
	 * out market id
	 */
	public void addRemoveIds(int id){
		super.addPara(OverMark.RemoveId, id);
	}
	public Object getRemoveIds(){
		super.remove(OverMark.RemoveId);	//先删除
		Object obj = super.getObject(OverMark.RemoveId);
		return obj;
	}
	
/*	public void setM10Beili_Top(BeiliDto dto){
		super.setPara(Mark.Beili_M10_Top, dto);
	}
	public BeiliDto getM10Beili_Top(){
		return (BeiliDto) super.getObject(Mark.Beili_M10_Top);
	}
	public void setM10Beili_Bot(BeiliDto dto){
		super.setPara(Mark.Beili_M10_Bot, dto);
	}
	public BeiliDto getM10Beili_Bot(){
		return (BeiliDto) super.getObject(Mark.Beili_M10_Bot);
	}*/
	

	
	public String getName() {
		return name;
	}

	public static void main(String[] args) {
		OverallPareManager.getSingleInstance("name").setOutSysFlag(true);
		OverallPareManager.getSingleInstance("name").setOutSysFlag(false);
		boolean b = OverallPareManager.getSingleInstance("name").isOutSysFlag();
		System.out.println(b);
	}
}
