package ea.service.res.db.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ea.server.Controller;
import ea.service.res.data.indicator.KDDto;
import ea.service.res.db.mapper.ExeDataMapper;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.DevBrkDto;
import ea.service.res.dto.OrderDto;
import ea.service.utils.base.Mark;

//表明该文件需要事务
@Transactional
// 表明该文件是一个Service
@Service
public class ExeDataService {

    @Autowired
    private ExeDataMapper exeDataMapper;
    
    private HashMap<String, Object> map = new HashMap<String, Object>();;
    
    public void truncateTable(String table){
    	try{	
    		this.exeDataMapper.truncateTable(table);
		} catch (Exception e) {
			Controller.log.error("变更错误：ExeDataService.truncateTable");
            e.printStackTrace();
        }
    }

    public List<BaseDto> exeFx(int period, int cno, int fx_cno){
    	try {
    		return this.exeDataMapper.exeFx(period, cno, fx_cno);
    	} catch (Exception e) {
    		Controller.log.debug(period + "分钟周期, 测试分笔运行到" + cno + "出错 !!");
            e.printStackTrace();
        }
    	return null;
    }
    
    public void addRemark(int period, int cno, int type, int dir, String time, double price, int bno){
    	this.map.put("period",period);	this.map.put("cno",cno);
    	this.map.put("type",type);		this.map.put("dir",dir);
    	this.map.put("time",time);		this.map.put("price",price);
    	this.map.put("bno",bno);
    	try {
    		this.exeDataMapper.addRemark(this.map);
    	} catch (Exception e) {
    		Controller.log.debug(period + "分钟周期, 测试分笔运行到" + cno + "出错 !!");
            e.printStackTrace();
        }
    }
    
    public List<BaseDto> clearRemarkByPeriod(String periods){
    	try {
    		return this.exeDataMapper.clearRemarkByPeriod(periods);
    	} catch (Exception e) {
    		Controller.log.error("变更错误：ExeDataService.clearRemarkByPeriod");
            e.printStackTrace();
        }
    	return null;
    }
    
    public void addDevRemark(DevBrkDto dto){
/*    	this.map.put("period", dto.getPeriod());	this.map.put("cno",dto.getCno());
    	this.map.put("updn",dto.getUpdn());			this.map.put("dir",dto.getDir());
    	this.map.put("time",dto.getTime());			this.map.put("price",dto.getPrice());
    	this.map.put("dev_cno",dto.getDev_cno()); 	
    	
    	this.map.put("kdif1",dto.getKdif1());		this.map.put("kdif2",dto.getKdif2());
    	this.map.put("ang1",dto.getAng1());			this.map.put("ang2",dto.getAng2());
    	this.map.put("ang3",dto.getAng3());			this.map.put("md1",dto.getMd1());*/
    	try {
    		this.exeDataMapper.addDevRemark(dto);
    	} catch (Exception e) {
    		Controller.log.debug(dto.getPeriod() + "分钟周期添加Dev时" + dto.getCno() + "出错 !!");
            e.printStackTrace();
        }
    }
    
    public void addBrkRemark(DevBrkDto dto){
    	this.map.put("period",dto.getPeriod());	this.map.put("ecno",dto.getEcno());
    	this.map.put("cno",dto.getCno());			this.map.put("brk_cno",dto.getBrk_cno());
    	this.map.put("updn",dto.getUpdn());		this.map.put("dir",dto.getDir());
    	this.map.put("time",dto.getTime());		this.map.put("price",dto.getVal());
		
    	try {
    		this.exeDataMapper.addBrkRemark(this.map);
    	} catch (Exception e) {
    		Controller.log.debug(dto.getPeriod() + "分钟周期添加Brk时" + dto.getEcno() + "出错 !!");
            e.printStackTrace();
        }
    }
    
    public void exeSql(String sql){
    	try {
    		this.exeDataMapper.exeSql(sql);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.exeSql");
            e.printStackTrace();
        }
    }
    
    public void changeEngine(String table, String type){
    	try {
    		this.exeDataMapper.changeEngine(table, type);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.changeEngine");
            e.printStackTrace();
        }
    }
    
    public void saveTable(String table, String year){
    	try {
    		this.exeDataMapper.saveTable(table,year);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.saveTable");
            e.printStackTrace();
        }
    }
    
    public void addOrder(OrderDto dto){
    	try {
    		this.exeDataMapper.addOrder(dto);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.addOrder");
            e.printStackTrace();
        }
    }
    
    public void updateOrder(OrderDto dto){
    	try {
    		if(dto.getState() == Mark.Order_state_ing){	//如果是处理状态，默认设置为处理结束
				dto.setState(Mark.Order_state_end);
			}
    		this.exeDataMapper.updateOrder(dto);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.updateOrder");
            e.printStackTrace();
        }
    }
    
    public BaseDto checkBreakMin(int period, int bin_cno, int end_cno){
    	try {
    		return this.exeDataMapper.checkBreakMin(period, bin_cno, end_cno);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.checkBreakMin");
            e.printStackTrace();
        }
    	return null;
    }
    
    public BaseDto checkBreakMax(int period, int bin_cno, int end_cno){
    	try {
    		return this.exeDataMapper.checkBreakMax(period, bin_cno, end_cno);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.checkBreakMax");
            e.printStackTrace();
        }
    	return null;
    }
    
    public void addForm(int period, int cno, int dir){
    	try {
    		this.exeDataMapper.addForm(period, cno, dir);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.addForm");
            e.printStackTrace();
        }
    }
    
    public void addCandleByTab(String table, CandlesDto dto){
    	try {
    		this.exeDataMapper.addCandleByTab(table, dto.getCno(), dto.getTime(), dto.getOpen(), dto.getClose(), dto.getHigh(), dto.getLow());
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.addCandleByTab");
            e.printStackTrace();
        }
    }
    
    public void addCandleByTab(String table, long cno,  long time, double open, double close, double high, double low){
    	try {
    		this.exeDataMapper.addCandleByTab(table, cno, time, open, close, high, low);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.addCandleByTab");
            e.printStackTrace();
        }
    }
    
    public List<OrderDto> getOrderDtos(final int dir){
    	try {
    		return this.exeDataMapper.getOrderDtos(dir);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.getOrderDtos");
            e.printStackTrace();
        }
    	return null;
    }
    
    public void addKD(KDDto dto){
    	try {
    		this.exeDataMapper.addKD(dto);
        } catch (Exception e) {
        	Controller.log.error("执行错误：GetDataService.addKD");
            e.printStackTrace();
        }
    }
}
