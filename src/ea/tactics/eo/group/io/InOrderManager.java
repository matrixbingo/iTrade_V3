package ea.tactics.eo.group.io;

import utils.mail.Mail;
import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.OrderDto;
import ea.service.utils.base.Mark;

/**
 * 进场管理：包括监听
 */

public class InOrderManager {
	private static InOrderManager singleInstance = null;
	private OrderDto dto = null;
	//private int ecno	 = 0;
	public static InOrderManager getSingleInstance(){
		if (singleInstance == null) {
			synchronized (InOrderManager.class) {
				if (singleInstance == null) {
					singleInstance = new InOrderManager();
				}
			}
		}
		return singleInstance;
	}
	/**
	 * V1、
	 */
	final public void inMarketByType(int version, int dir, int type, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto_k_01){

		this.dto = new OrderDto(version);
	
		this.initOrderDto(this.dto, dir, type, dto_dvt_30, dto_dvt_10, dto_dvt_05, dto_k_01);
/*		if(this.inListen(this.dto)){
			return;
		}*/
		
		this.inMarket(this.dto);
		
		Mail.sendMailInMarket(version, dir, type);
	}
	
	final public void inMarket(OrderDto dto){
		switch(dto.getDir()){
			case Mark.Action_Type_Buy  :	Data.orderData.inUpOrder(dto);
				break;
			case Mark.Action_Type_Sell :	Data.orderData.inDnOrder(dto);
				break;
		}
	}
	/**
	 * 进场监听：不符合条件返回false
	 */
	final private boolean inListen(OrderDto dto){
		switch(dto.getVersion()){
			case Mark.Version_v01 : return this.check_V1();
		}
		return false;
	}
	
	final private boolean check_V1(){
		
		return false;
	}
	
	/**
	 * V4、可用
	 */
	final private void initOrderDto(OrderDto dto, int dir, int type, BeiliDto dto_dvt_30, BeiliDto dto_dvt_10, BeiliDto dto_dvt_05, CandlesDto dto_k_01){
/*		if(null != dto_dvt_30){
			dto.setEcno(dto_dvt_30.getCno());
		}else if(dto.getVersion() == Mark.Version_v03){
			dto.setEcno(Data.conditionFxManager.getFmDtoByPeriod(Mark.Period_M10).getF_dto().getC1());
		}else{
			dto.setEcno(Data.conditionManager.getFmDtoByPeriod(Mark.Period_M30).getF_dto().getC1());	// M30没有则取当前最新分笔的CNO
		}*/
		dto.setEcno(dto_k_01.getCno());
		dto.setType(type);
		dto.setIcno(dto_k_01.getCno());			//必填，需要转换成5分钟CNO
		dto.setDir(dir);
		
		if(null != dto_dvt_05){
			dto.setIn_dvt05(dto_dvt_05.getCno());
		}
		
		if(null != dto_dvt_10){
			dto.setIn_dvt10(dto_dvt_10.getCno());
		}
		
		if(null != dto_dvt_30){
			dto.setIn_dvt30(dto_dvt_30.getCno());
		}
		if(dir == Mark.Action_Type_Buy){
			dto.setIn_price(dto_k_01.getLow());
		}else{
			dto.setIn_price(dto_k_01.getHigh());
		}
		
		dto.setIn_time(dto_k_01.getTime());
	}
}
