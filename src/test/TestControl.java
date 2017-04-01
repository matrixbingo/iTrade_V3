package test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.dbcp.BasicDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.db.control.ExeDataControl;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.FxMod;
import ea.service.res.dto.InitDataMod;
import ea.service.res.dto.OrderDto;
import ea.service.res.dto.PriceDto;
import ea.service.res.dto.SectionDto;
import ea.service.res.dto.macd.MacdMod;
import ea.service.res.period.RefreshCandles;
import ea.service.utils.base.Mark;

public class TestControl {
	public static ExeDataControl  exeDataControl = ExeDataControl.getSingleInstance();
	
	public static void test_GetRangeMacdExt(){
		FenBiInfoDto fxDto = new FenBiInfoDto(Mark.Period_M10);
    	fxDto.setPeriod(5);
    	fxDto.setC6(10);
    	fxDto.setC5(100);
    	fxDto.setC4(400);
    	fxDto.setC3(700);
    	fxDto.setC2(1000);
    	fxDto.setC1(2000);
    	
		List<MacdMod> list = Data.getDataControl.getRangeMacdExt("t_macd", fxDto);
    	Iterator it = list.iterator();
    	while(it.hasNext()){
    		MacdMod dto = (MacdMod)it.next();
    		System.out.println(dto.getRow() + " : " + String.valueOf(dto.getMax()) + " : " + String.valueOf(dto.getMin()));
    	}
	}
	
    public static void test_getFenBiInfo() {
    	List<FxMod> list = Data.getDataControl.getFenBiInfoByType(5, true, null, 20120906122000L);
    	Iterator it = list.iterator();
    	while(it.hasNext()){
    		FxMod dto = (FxMod)it.next();
    		System.out.println(dto.getCno() + " : " + dto.getPrice());
    	}
    }
    
	public static void test_GetPriceDto(){
		PriceDto dto = Data.getDataControl.getPriceDto("20120902230100", "20120906122000");
		System.out.println(dto.getMaxPrice() + " : " + dto.getMinPrice());
    	
	}
	
	public static void test_InitData(){

		List<InitDataMod> list = Data.getDataControl.initData(Controller.t_trade, Mark.Action_Type_Buy, Mark.Action_Type_Sell);
    	Iterator it = list.iterator();
    	while(it.hasNext()){
    		InitDataMod dto = (InitDataMod)it.next();
    		System.out.println(dto.getId() + ":" + dto.getRno());
    	}
	}
	

	public static void test_truncateTables(){
		System.out.println(Controller.clearTabs);
		String[] clearTabs = Controller.clearTabs.split("\\.");
		for(int i=0 ; i<=clearTabs.length ;i++){
			System.out.println(clearTabs[i]);
			//DbUpdateControl.truncateTable(clearTabs[i]);
		}
		exeDataControl.truncateTable(Controller.t_trade);
	}
	
	
	public static void test_exeSqlToMap(){
		HashMap<String,Object> map = Data.getDataControl.exeSqlToMap("call getCount('myuser');");
		System.out.println(map.get("num"));	
	}
	
	public static void test_exeSqlToDto(){
		//BaseDto dto = (BaseDto) Data.getDataControl.exeSqlToDto("call getCount('myuser');");
		//System.out.println(dto.getNum());
		
	}

	public static void test_getCandle(){
		int in = Data.getDataControl.getCount("myuser");
		System.out.println(in);
	}
	
	public static void test_getCount(){
		int in = Data.dBHandler.getCount("t_candle");
		System.out.println(in);
	}
	
	public static void test_getMaxId(){
		long in = Data.dBHandler.getMaxId("t_candle");
		System.out.println(in);
	}
	
	public static void test_getMaxTime(){
		BaseDto dto = Data.getDataControl.getMaxMinTime("t_candle");
		System.out.println(dto.getBin() + " -- " + dto.getEnd());
	}
	
	public static void test_isUniqueTime(){
		//boolean in = Data.getDataControl.isUniqueTime("t_candle","20120102070100");
		//System.out.println(in);
	}
	
	public static void test_getClearNumByPeriod(){
		int in = Data.getDataControl.getClearNumByPeriod(5);
		System.out.println(in);
	}
		
	public static void test_getCnoByTime(){
		int in = Data.getDataControl.getCnoByTime("t_candle", 20050102230200L);
		System.out.println(in);
	}
	
	public static void test_getSection(){
		SectionDto in = Data.getDataControl.getSection(5, 20050101000000L);
		System.out.println(in);
	}
	
	public static void test_isExistRemark(){
//		boolean in = DbSelectControl.isExistRemark(5, 505, -1, -2);
//		System.out.println(in);
	}
	
	public static void test_addRemark(){
		exeDataControl.addRemark(1, 505, -1, -2, "20120904173000", 1, 2550);
	}
	
	public static void test_clearRemarkByPeriod1(){
		//String in = DbUpdateControl.clearRemarkByPeriod(5);
		String[] arrs =  "505,505,783,783,999,999,1128,1719,1719,1874,1874,1919,1919,1942,1942,2206,2206,2405,3124,3603,3603,3".split(",");
		int leng = arrs.length;
		for(int i = 0; i < leng; i++){
			System.out.println(arrs[i]);
		}
	}
	
	public static void test_clearRemarkByPeriod(){
		List<BaseDto> list = exeDataControl.clearRemarkByPeriod("5,30");
		Iterator<BaseDto> it = list.iterator();
		BaseDto dto = null;
		while(it.hasNext()){
			dto = it.next();
			System.out.println(dto.getPeriod() + "--- "+ dto.getCno());
		}
	}
	
/*	public static void test_getMiKDataByPeriod(){
		CandlesDto dto = Data.miData.getMiKDataByPeriod(1, 3);
		System.out.println(dto.getPeriod() + " - "+ dto.getCno() + " - "+ dto.getTime() + " - "+ dto.getOpen() + " - "+ dto.getClose() + " - "+ dto.getHigh() + " - "+ dto.getLow());
		dto = Data.miData.getMiKDataByPeriod(1, "20120102070700");
		System.out.println(dto.getPeriod() + " - "+ dto.getCno() + " - "+ dto.getTime() + " - "+ dto.getOpen() + " - "+ dto.getClose() + " - "+ dto.getHigh() + " - "+ dto.getLow());
		dto = Data.miData.getM1KData();
		System.out.println(dto.getPeriod() + " - "+ dto.getCno() + " - "+ dto.getTime() + " - "+ dto.getOpen() + " - "+ dto.getClose() + " - "+ dto.getHigh() + " - "+ dto.getLow());
		
		dto = Data.miData.getMiKDataByPeriod(5, 3);
		System.out.println(dto.getPeriod() + " - "+ dto.getCno() + " - "+ dto.getTime() + " - "+ dto.getOpen() + " - "+ dto.getClose() + " - "+ dto.getHigh() + " - "+ dto.getLow());
		dto = Data.miData.getMiKDataByPeriod(5, "20120102070500");
		System.out.println(dto.getPeriod() + " - "+ dto.getCno() + " - "+ dto.getTime() + " - "+ dto.getOpen() + " - "+ dto.getClose() + " - "+ dto.getHigh() + " - "+ dto.getLow());
		dto = Data.miData.getM5KData();
		System.out.println(dto.getPeriod() + " - "+ dto.getCno() + " - "+ dto.getTime() + " - "+ dto.getOpen() + " - "+ dto.getClose() + " - "+ dto.getHigh() + " - "+ dto.getLow());
	}*/
	
/*	public static void test_getM1CandleByM5Cno(){
		CandlesDto dto = Data.dBHandler.getM1CandleByM5Cno(2);
		if(null == dto){
			System.out.println("null---------->");
		}else{
			System.out.println(dto.getPeriod() + " - "+ dto.getCno() + " - "+ dto.getTime() + " - "+ dto.getOpen() + " - "+ dto.getClose() + " - "+ dto.getHigh() + " - "+ dto.getLow());
		}
	}*/
	
	public static void test_addDevRemark(){
		int period = 5,cno = 1,updn = 1,dir = 1, dev_cno = 14;
		double price= 1.003;
		long time = 20130303031000L;
		//Data.exeDataControl.addDevRemark(period, cno, updn, dir, dev_cno, price, time);
	}
	
	public static void test_getclearCnoPeriods(){
		List<BaseDto> list = Data.getDataControl.getclearCnoPeriods();
		Iterator it = list.iterator();
    	while(it.hasNext()){
    		BaseDto dto = (BaseDto)it.next();
    		System.out.println(dto.getNum() + ":" + dto.getCno() + ":" + dto.getPeriod());
    	}
	}
	
	public static void test_addBrkRemark(){
		int period = 5,ecno = 1,updn = 1,dir = 1, brk_cno = 14;
		double price= 1.003;
		long time = 20130303031000L;
		//Data.exeDataControl.addBrkRemark(period, ecno, updn, dir, brk_cno, price, time);
	}
	
	public static void test_getPageNum(){
		List<BaseDto> list = Data.getDataControl.getPageNum("t_candle_30", Controller.pageNums);
		Iterator it = list.iterator();
    	while(it.hasNext()){
    		BaseDto dto = (BaseDto)it.next();
    		System.out.println(dto.getNum() + ":" + dto.getBin() + ":" + dto.getEnd());
    	}
	}
	
	public static void test_exeFx(){
		Data.dBHandler.clearTabs();	
		Iterator<BaseDto> it = null;
		int i = 0;
		while(i<1000){
			i++;
			List<BaseDto> rs = exeDataControl.exeFx(30, i,0);
			if(null == rs || 0 == rs.size()){
				continue;
			};
			it = rs.iterator();
	    	while(it.hasNext()){
	    		BaseDto dto = (BaseDto)it.next();
	    		System.out.println(dto.getRow() + ":" + dto.getMax() + ":" + dto.getMin());
	    	}
		}
	}
	
	public static void test_addOrder(){
		int ecno = 15,updn = 1,dir = 1, brk_cno = 24,icno = 11;
		double price= 1.003;
		long time = 20130303031000L;
		OrderDto dto = new OrderDto(1);
		dto.setEcno(ecno);
		dto.setDir(dir);
		dto.setType(11);
		dto.setIcno(icno);
		dto.setState(1);
		dto.setIn_dvt05(5);
		dto.setIn_dvt10(3);
		dto.setIn_brk05_dvt(3);
		dto.setIn_brk10_dvt(2);
		Data.exeDataControl.addOrder(dto);
	}
	
	public static void test_updateOrder(){
		int ecno = 5,updn = 1,dir = 1, brk_cno = 14,icno = 4;
		double price= 1.003;
		long time = 20130303031000L;
		OrderDto dto = new OrderDto(1);
		dto.setEcno(ecno);
		dto.setDir(dir);
		dto.setType(11);
		dto.setIcno(icno);
		dto.setState(1);
		dto.setIn_dvt05(5);
		dto.setIn_dvt10(3);
		dto.setIn_brk05_dvt(3);
		dto.setIn_brk10_dvt(2);
		Data.exeDataControl.addOrder(dto);
	}
	
	public static void test_ct(){
		BasicDataSource bean = (BasicDataSource)Controller.ct.getBean("dataSource");
		String url = bean.getUrl();
		int bin = url.indexOf("e_")+2;
		System.out.println(url.substring(bin, bin+4));
	}
	public static void test_cnoes(){
		ArrayList<Integer>	cnoes   = new ArrayList<Integer>();
		String[] cnos = "11721-11713-11707-11706".split("-");
		int i =  Integer.valueOf(cnos[0]);
		cnoes.add(0, i);
		cnoes.add(1, Integer.valueOf(cnos[1]));
		cnoes.add(2, Integer.valueOf(cnos[2]));
		cnoes.add(3, Integer.valueOf(cnos[3]));
		System.out.println(cnoes);
	}
	
	public static Logger 		log 				= LoggerFactory.getLogger(TestControl.class);
	public static void main(String[] args) {
		//test_addBrkRemark();
		
		//TestControl.test_truncateTables();
		//TestControl.test_InitData();
		//TestControl.test_getFenBiInfo();
		//TestControl.test_getSection();
		//test_clearRemarkByPeriod();
		//test_getFenBiInfo();
		//test_GetRangeMacdExt();
		//DbUpdateControl.truncateTable("myuser111");
		//test_GetPriceDto();
		//test_getMiKDataByPeriod();
		//test_getM1CandleByM5Cno();
		//test_addDevRemark();
		//test_getclearCnoPeriods();
		//test_getCount();
		test_getPageNum();
		//test_exeFx();
		//Data.dBHandler.clearTabs();	
		double b = 20120104013000.0000;
		//test_updateOrder();
		//test_addOrder();
		//System.out.println((long)b);
		//Data.dBHandler.changeEngine("InnoDB");
		//Data.dBHandler.saveTab("2012");
		/*CandlesDto dto_cl_m05 = Data.pageManager.getCandlesDtoByTime(Mark.Period_M5, 20120102070200L);
		System.out.println(dto_cl_m05);*/
		//test_getCnoByTime();
		//List<BaseDto> list = Data.getDataControl.showOrderMonth(2008);
		//System.out.println(list);
		
		//test_cnoes();
		//test_getFenBiInfo();
		
		//Data.dBHandler.clearTabs();				//清空表
		//RefreshCandles.getSingleInstance().creatPeriods();
		
		System.out.println(Controller.absPath);
	}
}
