package ea.module.beili.manager;

import java.util.ArrayList;

import utils.mail.Mail;
import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.InListDto;
import ea.service.utils.base.Mark;

public class BeiLiManagerListen{
	private static BeiLiManagerListen singleInstance = null;
	private ArrayList<InListDto> ilist_up_05_db = new ArrayList<InListDto>(), ilist_dn_05_db = new ArrayList<InListDto>(), ilist_up_10_db = new ArrayList<InListDto>(), ilist_dn_10_db = new ArrayList<InListDto>(), ilist_up_30_db = new ArrayList<InListDto>(), ilist_dn_30_db = new ArrayList<InListDto>();
	private ArrayList<InListDto> ilist_up_05_me = new ArrayList<InListDto>(), ilist_dn_05_me = new ArrayList<InListDto>(), ilist_up_10_me = new ArrayList<InListDto>(), ilist_dn_10_me = new ArrayList<InListDto>(), ilist_up_30_me = new ArrayList<InListDto>(), ilist_dn_30_me = new ArrayList<InListDto>();
	private ArrayList<InListDto> olist_up_05_db = new ArrayList<InListDto>(), olist_dn_05_db = new ArrayList<InListDto>(), olist_up_10_db = new ArrayList<InListDto>(), olist_dn_10_db = new ArrayList<InListDto>(), olist_up_30_db = new ArrayList<InListDto>(), olist_dn_30_db = new ArrayList<InListDto>();
	private ArrayList<InListDto> olist_up_05_me = new ArrayList<InListDto>(), olist_dn_05_me = new ArrayList<InListDto>(), olist_up_10_me = new ArrayList<InListDto>(), olist_dn_10_me = new ArrayList<InListDto>(), olist_up_30_me = new ArrayList<InListDto>(), olist_dn_30_me = new ArrayList<InListDto>();
	private ArrayList<Integer> list = null;
	
	public static BeiLiManagerListen getSingleInstance(){
		if (singleInstance == null) {
			synchronized (BeiLiManagerListen.class) {
				if (singleInstance == null) {
					singleInstance = new BeiLiManagerListen();
				}
			}
		}
		return singleInstance;
	}
	final public void listenBeili(FenBiInfoDto fxDto, BeiliDto dto, CandlesDto kData){
		switch(fxDto.getPeriod()){
			case Mark.Period_M05 : this.m05beiLiServer(fxDto, dto, kData);
				break;
			case Mark.Period_M10 : this.m10beiLiServer(fxDto, dto, kData);
				break;
			case Mark.Period_M30 : this.m30beiLiServer(fxDto, dto, kData);
				break;
		}
	}
	
	private BeiLiManagerListen(){
		//-- 进场
		if(Controller.isDbFx){
			//--- in
			this.ilist_dn_05_db.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v03, Mark.Order_Dir_v06)));
			this.ilist_dn_10_db.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v03, Mark.Order_Dir_v06)));
			this.ilist_dn_30_db.add(new InListDto(Mark.Version_v02, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v01)));
			
			this.ilist_up_05_db.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v03, Mark.Order_Dir_v06)));   // 多
			this.ilist_up_10_db.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v03, Mark.Order_Dir_v06)));
			this.ilist_up_30_db.add(new InListDto(Mark.Version_v02, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v01)));
			
			//-- out
			this.olist_dn_05_db.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02, Mark.Order_Dir_v03, Mark.Order_Dir_v04, Mark.Order_Dir_v05, Mark.Order_Dir_v06)));  // 空
			this.olist_dn_05_db.add(new InListDto(Mark.Version_v02, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v01)));
		
			this.olist_up_05_db.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Buy,  this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02, Mark.Order_Dir_v03, Mark.Order_Dir_v04, Mark.Order_Dir_v05, Mark.Order_Dir_v06)));	  // 多
			this.olist_up_05_db.add(new InListDto(Mark.Version_v02, Mark.Action_Type_Buy,  this.addlist(Mark.Order_Dir_v01)));
		}

		if(Controller.isMeFx){
			//-- in
			this.ilist_up_05_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v03)));
			this.ilist_up_10_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02, Mark.Order_Dir_v03)));
			this.ilist_up_30_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Buy, this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02)));
			
			this.ilist_dn_05_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v03)));
			this.ilist_dn_10_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02, Mark.Order_Dir_v03)));
			this.ilist_dn_30_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02)));
			
			//-- out
			this.olist_dn_10_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v03), Mark.OutMarket_1));
			this.olist_up_10_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Buy,  this.addlist(Mark.Order_Dir_v03), Mark.OutMarket_1));
			
			this.olist_dn_30_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Sell, this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02, Mark.Order_Dir_v03)));
			this.olist_up_30_me.add(new InListDto(Mark.Version_v03, Mark.Action_Type_Buy,  this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02, Mark.Order_Dir_v03)));
		}
	}
	
	final private void m05beiLiServer(FenBiInfoDto fxDto, BeiliDto dto, CandlesDto m01_Data) {
		if(dto.isBeili()){
			/*if(dto.getCno() >= 3210){
				System.out.println(dto.getCno());
			}*/
			if(fxDto.getType() == Mark.Fx_Db){
				Data.conditionManager.addBeiliRemark(dto);
				Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Beili_Bot ? this.ilist_up_05_db : this.ilist_dn_05_db);
				Data.otOrderManager.otMarket(dto.getUpdn() == Mark.Beili_Bot ? this.olist_dn_05_db : this.olist_up_05_db);
			}else{
				Data.conditionFxManager.addBeiliRemark(dto);
				Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Beili_Bot ? this.ilist_up_05_me : this.ilist_dn_05_me);
				Data.otOrderManager.otMarket(dto.getUpdn() == Mark.Beili_Bot ? this.olist_dn_05_me : this.olist_up_05_me);
			}
			
			Data.mail.sendMail_Dvt(fxDto, dto);
		}
	}
	
	final private void m10beiLiServer(FenBiInfoDto fxDto, BeiliDto dto, CandlesDto m01_Data) {
		if(dto.isBeili()){
			if(fxDto.getType() == Mark.Fx_Db){
				Data.conditionManager.addBeiliRemark(dto);
				Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Beili_Bot?this.ilist_up_10_db : this.ilist_dn_10_db);
				Data.otOrderManager.otMarket(dto.getUpdn() == Mark.Beili_Bot ? this.olist_dn_10_db : this.olist_up_10_db);
			}else{
				Data.conditionFxManager.addBeiliRemark(dto);
				Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Beili_Bot?this.ilist_up_10_me : this.ilist_dn_10_me);
				Data.otOrderManager.otMarket(dto.getUpdn() == Mark.Beili_Bot ? this.olist_dn_10_me : this.olist_up_10_me);
			}
			
			Data.mail.sendMail_Dvt(fxDto, dto);
		}
	}
	
	final private void m30beiLiServer(FenBiInfoDto fxDto, BeiliDto dto, CandlesDto m01_Data) {
		if(dto.isBeili()){
			/*if(dto.getCno() >= 166){
				System.out.println(dto.getCno());
			}*/
			if(fxDto.getType() == Mark.Fx_Db){
				Data.conditionManager.addBeiliRemark(dto);
				Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Beili_Bot ? this.ilist_up_30_db : this.ilist_dn_30_db);
				Data.otOrderManager.otMarket(dto.getUpdn() == Mark.Beili_Bot ? this.olist_dn_30_db : this.olist_up_30_db);
			}else{
				Data.conditionFxManager.addBeiliRemark(dto);
				Data.tacticsManager.exeTactics(dto.getUpdn() == Mark.Beili_Bot ? this.ilist_up_30_me : this.ilist_dn_30_me);
				Data.otOrderManager.otMarket(dto.getUpdn() == Mark.Beili_Bot ? this.olist_dn_30_me : this.olist_up_30_me);
			}
			
			Data.mail.sendMail_Dvt(fxDto, dto);
		}
	}
	
	final private ArrayList<Integer> addlist(int ...ints){
		this.list = new ArrayList<Integer>();
		for(int i : ints){
			this.list.add(i);
		}
		return this.list;
    }
}
