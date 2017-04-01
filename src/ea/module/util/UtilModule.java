package ea.module.util;

import java.util.Iterator;
import java.util.List;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.macd.MacdPointDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Maths;

/**
 * 背离和突破的工具类
 * @author Liang.W.William
 */
public class UtilModule {
	private static UtilModule singleInstance = null; //唯一实例
	private double p1, p2, p3, p4;
	private int c1, c2, c3, c4;
	private int kdif1 = 0, kdif2 = 0, ang1 = 0, ang2 = 0, ang3 = 0, md1 = 0;
	
	public static UtilModule getSingleInstance(){
		if (singleInstance == null) {
			synchronized (UtilModule.class) {
				if (singleInstance == null) {
					singleInstance = new UtilModule();
				}
			}
		}
		return singleInstance;
	}
	
	/**
	 * 清洗指定周期的背离点和突破点，如果为0，则清洗全部周期
	 */
	public void clearRemark(){
		if(Controller.isClearFx){
			return;
		}
/*		List<BaseDto> list = Data.exeDataControl.clearRemarkByPeriod(Controller.clearPeriods);
		Iterator<BaseDto> it = list.iterator();
		BaseDto dto = null;
		while(it.hasNext()){
			dto = it.next();
			ConditionManager.getSingleInstance().clearRemarkDto(dto.getPeriod(), dto.getCno());
			this.oMarket(dto.getPeriod(), dto.getCno());
		}*/
		
		List<BaseDto> list = Data.getDataControl.getclearCnoPeriods();
		Iterator<BaseDto> it = list.iterator();
		BaseDto dto = null;
    	while(it.hasNext()){
    		dto = it.next();
    		Data.conditionManager.clearRemarkDto(dto);
			this.oMarket(dto.getPeriod(), dto.getCno());
    	}
	}
	/**
	 * 指标失效出场
	 */
	private void oMarket(int period, int cno){
		if(Controller.isIndexInvalid){
			return;
		}
/*		switch(period){
			case Mark.Period_M10 :  if(Controller.isIndexInvalid_m10)EOMarketDBControl.getSingleInstance().oMarketByCno(cno, Mark.Period_M10);		//M10失效，out market
				break;
			case Mark.Period_M30 :	if(Controller.isIndexInvalid_m30)EOMarketDBControl.getSingleInstance().oMarketByCno(cno, Mark.Period_M30);		//M30失效，out market
				break;
		}*/
	}
	
	/**未使用
	private void clearRemarkByPeriod(int period){
		String[] arrs =  ExeDataControl.clearRemarkByPeriod(period).split(",");
		int leng = arrs.length;
		for(int i = 0; i < leng; i++){
			ConditionDataManager.getSingleInstance().clearRemarkDto(period, Integer.valueOf(arrs[i]));
		}
	}
	*/
	
	/**
	 * 设置角度，增度等其他数据 top1 bot1
	 */
	final public void setBeiliCheck_One(BeiliDto dto, FenBiInfoDto fxDto, MacdPointDto md){
		this.p1 = fxDto.getP1(); this.p2 = fxDto.getP2(); this.p3 = fxDto.getP3(); this.p4 = fxDto.getP4();
		switch(dto.getPeriod()){
			case Mark.Period_M05  : this.c1 = fxDto.getC1()*5;  this.c2 = fxDto.getC2()*5;  this.c3 = fxDto.getC3()*5;  this.c4 = fxDto.getC4()*5;
				break;
			case Mark.Period_M10 : this.c1 = fxDto.getC1()*10; this.c2 = fxDto.getC2()*10; this.c3 = fxDto.getC3()*10; this.c4 = fxDto.getC4()*10;
				break;
			case Mark.Period_M30 : this.c1 = fxDto.getC1()*30; this.c2 = fxDto.getC2()*30; this.c3 = fxDto.getC3()*30; this.c4 = fxDto.getC4()*30;
				break;
		}
		//价格增减/CNO增
		this.kdif1 	= Maths.priceToIntFour((double)Maths.alsSubPrice(this.p1, this.p2)/Math.abs(this.c1-this.c2));
		this.kdif2 	= Maths.priceToIntFour((double)Maths.alsSubPrice(this.p3, this.p4)/Math.abs(this.c3-this.c4));
		//角度/CNO增
		this.ang1 	= Maths.priceToIntFour((double)Maths.getAngle(this.c1, this.p1, this.c2, this.p2)/Math.abs(this.c1-this.c2));
		this.ang2 	= Maths.priceToIntFour((double)Maths.getAngle(this.c2, this.p2, this.c3, this.p3)/Math.abs(this.c2-this.c3));
		this.ang3 	= Maths.priceToIntFour((double)Maths.getAngle(this.c3, this.p3, this.c4, this.p4)/Math.abs(this.c3-this.c4));
		//MACD增减/CNO增
		this.md1 	= Maths.priceToIntFour((double)Maths.alsSub(md.getF3(), md.getF1())/Math.abs(this.c1-this.c4));

		//测试参数
		dto.setKdif1(this.kdif1);
		dto.setKdif2(this.kdif2);
		dto.setAng1(this.ang1);
		dto.setAng2(this.ang2);
		dto.setAng3(this.ang3);
		dto.setMd1(this.md1);
	}
	/**
	 * 设置角度，增度等其他数据
	 *  top2 bot2
	
	@SuppressWarnings("unused")
	final public void setBeiliCheck_Two(BeiliDto dto, FenBiInfoDto fxDto, MacdPointDto md){
		double p1 = fxDto.getP1(), p2 = fxDto.getP2(), p3 = fxDto.getP3(), p4 = fxDto.getP4(), p5 = fxDto.getP5(), p6 = fxDto.getP6();
		long t1 = fxDto.getT1(), t2 = fxDto.getT2(), t3 = fxDto.getT3(), t4 = fxDto.getT4(), t5 = fxDto.getT5(), t6 = fxDto.getT6();
		int kdif1 = 0, kdif2 = 0, ang1 = 0, ang2 = 0, ang3 = 0, md1 = 0, md2 = 0;
		kdif1 = Maths.alsSub(p2, p4);
		kdif2 = Maths.alsSub(p3, p5);
		ang1 = Maths.getAngle(t2, p2, t3, p3);
		ang2 = Maths.getAngle(t3, p3, t4, p4);
		ang3 = Maths.getAngle(t4, p4, t5, p5);
		md1 = Maths.alsSub(md.getF4(), md.getF2());
		//测试参数
		dto.setKdif1(kdif1);
		dto.setKdif2(kdif2);
		dto.setAng1(ang1);
		dto.setAng2(ang2);
		dto.setAng3(ang3);
		dto.setMd1(md1);
		dto.setMd2(md2);
	} */
}
