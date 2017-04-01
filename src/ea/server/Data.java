package ea.server;

import utils.mail.Mail;
import ea.module.beili.manager.BeiLiManager_Db;
import ea.module.beili.manager.BeiLiManager_Me;
import ea.module.beili.manager.BeiLiManager_Se;
import ea.module.breaks.BreakManager;
import ea.module.fx.manager.FxManager;
import ea.module.fx.param.ParamFx;
import ea.module.util.UtilModule;
import ea.service.res.data.FxData;
import ea.service.res.data.FxMacdData;
import ea.service.res.data.InBrkMarketData;
import ea.service.res.data.MacdData;
import ea.service.res.data.MxData;
import ea.service.res.data.RangePriceData;
import ea.service.res.data.SectionData;
import ea.service.res.data.breaks.BreakDvtData;
import ea.service.res.data.breaks.BreakInMData;
import ea.service.res.data.condition.ConditionFxManager;
import ea.service.res.data.condition.ConditionManager;
import ea.service.res.data.condition.control.ConditionTactis;
import ea.service.res.data.indicator.KD;
import ea.service.res.data.move.MoveManager;
import ea.service.res.data.move.MoveParaData;
import ea.service.res.data.order.OrderData;
import ea.service.res.data.order.ProfitData;
import ea.service.res.data.page.PageManager;
import ea.service.res.data.remark.RemarksData;
import ea.service.res.db.control.DBHandler;
import ea.service.res.db.control.ExeDataControl;
import ea.service.res.db.control.GetDataControl;
import ea.tactics.eo.group.io.InOrderManager;
import ea.tactics.eo.group.io.OtOrderManager;
import ea.tactics.eo.group.util.Tactics_Util;
import ea.tactics.eo.manager.TacticsManager;
import ea.tactics.server.ServerIndex;

public class Data {
	
	public static final ExeDataControl	exeDataControl				=	ExeDataControl.getSingleInstance();
	public static final GetDataControl	getDataControl				=	GetDataControl.getSingleInstance();
	public static final DBHandler		dBHandler					=	DBHandler.getSingleInstance();
	
	public static final FxData 			fxdata 						=	FxData.getSingleInstance();
	public static final MacdData 		macdData 					=	MacdData.getSingleInstance();
	//public static final MiData 			miData 	 				=	MiData.getSingleInstance();
	public static final MxData 			mxData 	 					=	MxData.getSingleInstance();
	public static final RangePriceData 	rangePriceData 	 			=	RangePriceData.getSingleInstance();
	public static final SectionData 	sectionData 	 			=	SectionData.getSingleInstance();
	public static final RemarksData 	remarksData					=	RemarksData.getSingleInstance();
	public static final PageManager		pageManager 				=	PageManager.getSingleInstance();
	public static final FxMacdData		fxMacdData					=	FxMacdData.getSingleInstance();
	public static final OrderData		orderData					=	OrderData.getSingleInstance();
	public static final BreakDvtData	breakDvtData				=	BreakDvtData.getSingleInstance();
	public static final InBrkMarketData inBrkMarketData				=	InBrkMarketData.getSingleInstance();
	public static final BreakInMData    breakInMData				=	BreakInMData.getSingleInstance();
	
	public static final InOrderManager	inOrderManager				=	InOrderManager.getSingleInstance();
	public static final OtOrderManager	otOrderManager				=	OtOrderManager.getSingleInstance();
	public static final MoveManager		moveManager					=	MoveManager.getSingleInstance();
	
	public static final BeiLiManager_Db beiLiManager_Db 	 		=	BeiLiManager_Db.getSingleInstance();
	public static final BeiLiManager_Me beiLiManager_Me 	 		=	BeiLiManager_Me.getSingleInstance();
	public static final BeiLiManager_Se beiLiManager_Se 	 		=	BeiLiManager_Se.getSingleInstance();
	public static final BreakManager 	breakManager 	 			=	BreakManager.getSingleInstance();
	public static final FxManager 		fxManager 	 				=	FxManager.getSingleInstance(0);
	public static final UtilModule 		utilModule 	 				=	UtilModule.getSingleInstance();
	
	public static final ServerIndex		serverIndex					=	ServerIndex.getSingleInstance();
	public static final TacticsManager	tacticsManager				=	TacticsManager.getSingleInstance();
	
	//--Tesctics
	public static final ConditionTactis	 	conditionTactis			=	ConditionTactis.getSingleInstance();
	public static final ConditionManager 	conditionManager 		=	ConditionManager.getSingleInstance();
	public static final ConditionFxManager 	conditionFxManager 		=	ConditionFxManager.getSingleInstance();
	public static final Tactics_Util 	 	tactics_Util 			= 	Tactics_Util.getSingleInstance();
	public static final MoveParaData	 	moveParaData			=	MoveParaData.getSingleInstance();
	public static final ProfitData	 	 	profitData				=	ProfitData.getSingleInstance();
	
	public static final KD	 	 			kd						=	KD.getSingleInstance();
	public static final ParamFx				paramFx					=	ParamFx.getSingleInstance();
	
	//--Tools
	public static final Mail				mail					=	Mail.getSingleInstance();
	
}
