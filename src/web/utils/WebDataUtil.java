package web.utils;

import java.util.ArrayList;
import java.util.List;

import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.BreakDto;
import ea.service.res.dto.BrkDevInfoDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.KlinesDto;
import ea.service.res.period.Util;
import ea.service.utils.base.Mark;

public class WebDataUtil {
	private static WebDataUtil singleInstance = null; //唯一实例 
	public static WebDataUtil getSingleInstance(){
		if (singleInstance == null) {
			synchronized (WebDataUtil.class) {
				if (singleInstance == null) {
					singleInstance = new WebDataUtil();
				}
			}
		}
		return singleInstance;
	}
	private CandlesDto dto_k;
	private int pi = 1;//放大或缩小比例
	private StringBuffer sql = null;
	private String str = null;
	public static String[] title_Kline = { "cno", "time", "open", "high", "low", "price", "volume", "k" , "d"};
	public static String[] title_devBrk = { "time", "updn", "type", "name"};

    final public Object[] getKlinesData(List<KlinesDto> list) {
        Object[] objs = new Object[list.size()];
        for (int i = 0; i < list.size(); i++) {
        	KlinesDto dto = list.get(i);
            String[] obj = new String[9];
            obj[0] = dto.getCno() + "";
            obj[1] = dto.getTime() + "";
            obj[2] = dto.getOpen() * this.pi + "";
            obj[3] = dto.getHigh() * this.pi + "";
            obj[4] = dto.getLow() * this.pi + "";
            obj[5] = dto.getClose() * this.pi + "";	//最新价
            obj[6] = (i * 200) + "";//dto.getVolume() + "";	//总手
            obj[7] = dto.getK() * this.pi + "";
            obj[8] = dto.getD() * this.pi + "";
            objs[i] = obj;
        }
        return objs;
    }
    
    final public Object[] getBrkDevInfoData(List<BrkDevInfoDto> list) {
        Object[] objs = new Object[list.size()];
        for (int i = 0; i < list.size(); i++) {
        	BrkDevInfoDto dto = list.get(i);
            String[] obj = new String[4];
            obj[0] = dto.getTime() + "";
            obj[1] = dto.getUpdn() + "";
            obj[2] = dto.getType() + "";
            obj[3] = dto.getName() + "";
            objs[i] = obj;
        }
        return objs;
    }
    
	/*
	 * 取大于time 
	 */
    final public String getCandlsByPeriod_ASC(int period, String size, long time){
		this.sql = new StringBuffer();
		String tab = Util.getTabNameByPeriod(period);
		this.sql.append("select t1.cno, t1.time, t1.open, t1.close, t1.high, t1.low, t2.k, t2.d from " + tab + " t1 ");
		this.sql.append(" left JOIN t_kd t2 on t1.cno = t2.cno and t2.period = " + period);
		this.sql.append(" where t1.time > " + time);
		this.sql.append(" order by t1.time asc limit " + size);
		return sql.toString();
	}
	/*
	 * 取小于time 
	 */
    final public String getCandlsByPeriod_DSC(int period, String size, long time){
    	this.sql = new StringBuffer();
		String tab = Util.getTabNameByPeriod(period);
		this.sql.append("select t1.cno, t1.time, t1.open, t1.close, t1.high, t1.low, t2.k, t2.d from " + tab + " t1 ");
		this.sql.append(" left JOIN t_kd t2 on t1.cno = t2.cno and t2.period = " + period);
		this.sql.append(" where t1.time < " + time);
		this.sql.append(" order by t1.time desc limit " + size);
		return this.sql.toString();
	}
	/**
	 * 最新一条
	 */
    final public String getNewCandle(int period){
		String tab = Util.getTabNameByPeriod(period);
		this.str = "select cno,time,open,close,high,low from " + tab + " ORDER BY time desc limit 1";
		return this.str;
	}
    
//	/**
//	 * 获取fx
//	 */
//    final public String getFxSql(int period){
//		String tab = Util.getTabNameByPeriod(period);
//		this.str = "select t2.time, t1.topbtm as dir from  t_form t1 INNER JOIN " + tab + " t2 on t1.cno = t2.cno where t1.period = 1 ORDER BY t2.time DESC ";
//		return this.str;
//	}
    
    final public List<KlinesDto> selectKlineDate(int period, long time, int direction, int size) {
        String table = Util.getTabNameByPeriod(period);
        List<KlinesDto> list = Data.getDataControl.getCandlsByPeriod(table, period, time, direction, size);
        return list;
    }
	
    final public List<CandlesDto> getCandlesDto(int period, long time, String size){
		List<CandlesDto> list = new ArrayList<CandlesDto>();
		if(time == 0){
			list = Data.getDataControl.getCandlesBySql(this.getNewCandle(period));
		}else{
			list = Data.getDataControl.getCandlesBySql(this.getCandlsByPeriod_DSC(period, size, time));
		}
		return list;
	}
    
	/**
	 * 整合brk & dvt
	 */
    final public List<BrkDevInfoDto> getBrkDevInfoList(int period, BeiliDto dto_dvt, BreakDto dto_brk){
    	List<BrkDevInfoDto> list = new ArrayList<BrkDevInfoDto>();
    	BrkDevInfoDto dto_1 = new BrkDevInfoDto();
    	BrkDevInfoDto dto_2 = new BrkDevInfoDto();
    	
    	//dvt
    	if(null != dto_dvt && dto_dvt.isBeili()){
    		this.dto_k = Data.pageManager.getCandlesDtoByCno(period, dto_dvt.getCno());
    		dto_1.setName(dto_dvt.getUpdn() == 1 ? "dev_up" : "dev_dn");
    		dto_1.setTime(this.dto_k.getTime());	//System.out.println("BeiliDto : ---> " + dto_dvt.getCno() + " : " + this.dto_k.getTime());
    		dto_1.setType(Mark.Fx_Dvt);
    		dto_1.setUpdn(dto_dvt.getUpdn());
    	}
    	
		//brk
		if(null != dto_brk && dto_brk.isBreak()){
			dto_2.setName(dto_brk.getUpdn() == 1 ? "brk_up" : "brk_dn");
			dto_2.setTime(dto_brk.getBreakTime());
			dto_2.setType(Mark.Fx_Brk);
			dto_2.setUpdn(dto_brk.getUpdn());
		}
		
		if(dto_2.getTime() != 0 && dto_1.getTime() == dto_2.getTime()){
			BrkDevInfoDto dto = new BrkDevInfoDto();
			
			dto.setName(dto_1.getName() + " : " + dto_2.getName());
			dto.setTime(dto_1.getTime());
			dto.setType(Mark.Fx_Bth);
			dto.setUpdn(dto_2.getUpdn());
			
			list.add(dto);
		}else{
			list.add(dto_1);
			list.add(dto_2);
		}
		
    	return list;
    }
    
	public static void main(String[] args) {
		String sql = WebDataUtil.getSingleInstance().getCandlsByPeriod_DSC(1, "100", 20120105181700L);
		System.out.println(sql);
	}

}
