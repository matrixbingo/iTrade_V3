package ea.service.res.db.control;

import java.util.List;

import ea.server.Controller;
import ea.service.res.data.indicator.KDDto;
import ea.service.res.db.service.ExeDataService;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.DevBrkDto;
import ea.service.res.dto.OrderDto;

public class ExeDataControl{
	private ExeDataService exeDataService = (ExeDataService)Controller.ct.getBean("exeDataService");
	private static ExeDataControl singleInstance = null;
	
	public static ExeDataControl getSingleInstance(){
		if (singleInstance == null) {
			synchronized (ExeDataControl.class) {
				if (singleInstance == null) {
					singleInstance = new ExeDataControl();
				}
			}
		}
		return singleInstance;
	}
	
	/** 
	 * 清空表
	 */
	final public void truncateTable(String table){
		this.exeDataService.truncateTable(table);
    }
	/**
	 * 插入，更新等
	 */
	final public void exeSql(String sql){
		this.exeDataService.exeSql(sql);
    }
	/**
	 * 各周期分笔
	 */
	final public List<BaseDto> exeFx(int period, int cno, int fx_cno){
    	return this.exeDataService.exeFx(period, cno, fx_cno);
    }
    /**
     * 添加remark数据
     */
	final public void addRemark(int period, int cno, int type, int dir, String time, double price, int bno){
    	this.exeDataService.addRemark(period, cno, type, dir, time, price, bno);
    }
    /**
     * 010:根据对应周期清洗t_remark对应t_form已经清洗过的数据，并返回清洗的结果集period和cno
     */
	final public List<BaseDto>  clearRemarkByPeriod(String periods){
    	return this.exeDataService.clearRemarkByPeriod(periods);
    }
    /**
     * 016 添加dev数据,联合主键重复不添加
     */
	final public void addDevRemark(DevBrkDto dto){
    	this.exeDataService.addDevRemark(dto);
    }
    
    /**
     * 017 添加brk数据,联合主键重复不添加
     */
	final public void addBrkRemark(DevBrkDto dto){
    	this.exeDataService.addBrkRemark(dto);
    }
    
	final public void saveTable(String table, String year){
    	this.exeDataService.saveTable(table,year);
    }
    /**
     * 026 表存储转换
     */
	final public void changeEngine(String table, String type){
    	this.exeDataService.changeEngine(table, type);
    }
	
    /**
     * 027 添加进场 
     */
	final public void addOrder(OrderDto dto){
    	this.exeDataService.addOrder(dto);
    }
	
    /**
     * 028 更新进场,不会反复出场
     */
	final public void updateOrder(OrderDto dto){
    	this.exeDataService.updateOrder(dto);
    }
	
    /**
     * 030 如果区间最小值不低于前底，返回1：反之返回：0
     */
	final public boolean checkBreakMin(int period, int bin_cno, int end_cno){
		return this.exeDataService.checkBreakMin(period, bin_cno, end_cno).getNum() == 1;
	}
	
    /**
     * 031 如果区间最小值不高于前顶，返回1：反之返回：0
     */
	final public boolean checkBreakMax(int period, int bin_cno, int end_cno){
		return this.exeDataService.checkBreakMax(period, bin_cno, end_cno).getNum() == 1;
	}
	
    /**
     * 032 添加form数据
     */
	final public void addForm(int period, int cno, int dir){
		this.exeDataService.addForm(period, cno, dir);
	}
	
	/**
	 * 得到order数据 初始化
	 */
	final public List<OrderDto> getOrderDtos(int dir){
		return this.exeDataService.getOrderDtos(dir);
	}
	
	final public void addCandleByTab(String table, long cno, long time, double open, double close, double high, double low){
		this.exeDataService.addCandleByTab(table, cno, time, open, close, high, low);
	}
	/**
	 * 添加kd
	 */
	final public void addKD(KDDto dto){
		this.exeDataService.addKD(dto);
    }
}
