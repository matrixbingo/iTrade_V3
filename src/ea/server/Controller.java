package ea.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import ea.service.utils.base.ApplicationPath;
import ea.service.utils.var.control.UtilVar;
import ea.service.utils.var.server.manager.VarXmlManager;

/**
 * 常量服务加载XML和 prop
 */
public class Controller{
	public static final boolean isAbsPath			= true;	//是否使用绝对路径
	public static final String  data_key			= "e_";
	//public static final String	absPath 			= UtilVar.getSingleInstance().getStr("FileUtl");
	public static final String absPath 				= "/work/projects/iTrade_V3/WebContent";
	//public static final String	absPath 			= "D:\\Company\\workspace\\iTrade_V3\\iTrade_V3\\WebContent";
	public static final String	saveTab 			= "t_form.t_macd.t_break.t_deviate.t_order";
	
	public static final ApplicationContext ct 		= new ClassPathXmlApplicationContext("spring-configuration.xml");
	private static VarXmlManager config 			= VarXmlManager.getSingleInstance(new StringBuffer(ApplicationPath.conf_url).append("config.xml").toString());
	private static VarXmlManager base	 			= VarXmlManager.getSingleInstance(new StringBuffer(ApplicationPath.conf_url).append("base.xml").toString());
	private static VarXmlManager tactic	 			= VarXmlManager.getSingleInstance(new StringBuffer(ApplicationPath.conf_url).append("tactic.xml").toString());
	
	public static final int 	YEAR				= ApplicationPath.getDataBaseYear();
	
	public static Logger 		log 				= LoggerFactory.getLogger(Controller.class);
	
	//-- config.xml
	public static final boolean isMail				= config.isTrue("isMail");

	public static final String 	clearTabs			= config.getStr("clearTabs");
	public static final int  	pageNums			= config.getInt("pageNums");
	public static final String  tactics_package		= config.getStr("tactics_package");
	public static final boolean	isTest 				= config.isTrue("isTest");
	public static final boolean isBeili 			= config.isTrue("isBeili");
	public static final boolean isLastRun			= config.isTrue("isLastRun");
	public static final boolean isTimeOrder			= config.isTrue("isTimeOrder");
	public static final String  t_trade				= config.getStr("t_trade");
	public static final boolean isM30Loose			= config.isTrue("isM30Loose");
	public static final boolean isM10Loose			= config.isTrue("isM10Loose");
	
	public static final int		startMove_v1 		= config.getInt("startMove_v1");
	public static final int		margin_v1 			= config.getInt("margin_v1");
	public static final int		stopLoss_v1 		= config.getInt("stopLoss_v1");
	public static final int		startProfit_v1 		= config.getInt("startProfit_v1");
	public static final int		stopProfit_v1 		= config.getInt("stopProfit_v1");
	
	public static final int		startMove_v2 		= config.getInt("startMove_v2");
	public static final int		margin_v2 			= config.getInt("margin_v2");
	public static final int		stopLoss_v2 		= config.getInt("stopLoss_v2");
	public static final int		startProfit_v2 		= config.getInt("startProfit_v2");
	public static final int		stopProfit_v2 		= config.getInt("stopProfit_v2");
	
	public static final int		startMove_v3 		= config.getInt("startMove_v3");
	public static final int		margin_v3 			= config.getInt("margin_v3");
	public static final int		stopLoss_v3 		= config.getInt("stopLoss_v3");
	public static final int		startProfit_v3 		= config.getInt("startProfit_v3");
	public static final int		stopProfit_v3 		= config.getInt("stopProfit_v3");
	
	public static final int		startMove_v4 		= config.getInt("startMove_v4");
	public static final int		margin_v4 			= config.getInt("margin_v4");
	public static final int		stopLoss_v4 		= config.getInt("stopLoss_v4");
	public static final int		startProfit_v4 		= config.getInt("startProfit_v4");
	public static final int		stopProfit_v4 		= config.getInt("stopProfit_v4");
	
	public static final int		startMove_v5 		= config.getInt("startMove_v5");
	public static final int		margin_v5 			= config.getInt("margin_v5");
	public static final int		stopLoss_v5 		= config.getInt("stopLoss_v5");
	public static final int		startProfit_v5 		= config.getInt("startProfit_v5");
	public static final int		stopProfit_v5 		= config.getInt("stopProfit_v5");
	
	public static final String	t_macd 				= config.getStr("t_macd");
	public static final boolean	isM01Minute 		= config.isTrue("isM01Minute");
	public static final boolean	isM05M10Minute 		= config.isTrue("isM05M10Minute");
	
	public static final boolean	isMoveOutMarket	 	= config.isTrue("isMoveOutMarket");
	public static final boolean	isExactTrade 		= config.isTrue("isExactTrade");

	public static final boolean isM10BBOutMarket	= config.isTrue("isM10BBOutMarket");
	public static final int		outM10Num 			= config.getInt("outM10Num");
	
	public static final boolean	isRemark_beili 		= config.isTrue("isRemark_beili");
	public static final boolean	isRemark_break 		= config.isTrue("isRemark_break");
	public static final boolean	isRemark_sectn 		= config.isTrue("isRemark_sectn");
	
	public static final boolean	isDn01 				= config.isTrue("isDn01");
	public static final boolean	isUp01 				= config.isTrue("isUp01");
	public static final boolean	isDn02 				= config.isTrue("isDn02");
	public static final boolean	isUp02 				= config.isTrue("isUp02");
	public static final boolean	isDn03 				= config.isTrue("isDn03");
	public static final boolean	isUp03 				= config.isTrue("isUp03");
	public static final boolean	isDn04 				= config.isTrue("isDn04");
	public static final boolean	isUp04 				= config.isTrue("isUp04");
	public static final boolean	isDn05 				= config.isTrue("isDn05");
	public static final boolean	isUp05 				= config.isTrue("isUp05");
	
	public static final boolean	isExactM5 			= config.isTrue("isExactM5");
	
	public static final boolean	isExistInMarket_v4 	= config.isTrue("isExistInMarket_v4");
	public static final boolean	isPriceOutMarket_v4	= config.isTrue("isPriceOutMarket_v4");
	public static final boolean	isTimeOutMarket_v4	= config.isTrue("isTimeOutMarket_v4");
	public static final int		timeOutMarket_v4 	= config.getInt("timeOutMarket_v4");
	public static final int		priceOutMarket_v4 	= config.getInt("priceOutMarket_v4");
	public static final boolean	isOutMarketPro_v4 	= config.isTrue("isOutMarketPro_v4");
	public static final int		outMarketPro_v4 	= config.getInt("outMarketPro_v4");
	public static final boolean	isUseExDing_v4 		= config.isTrue("isUseExDing_v4");
	public static final boolean	isClearFx 			= config.isTrue("isClearFx");
	public static final String  clearPeriods		= config.getStr("clearPeriods");
	public static final int		existInMarket_v4 	= config.getInt("existInMarket_v4");
	public static final boolean	isDeficitNoMarket_v4= config.isTrue("isDeficitNoMarket_v4");
	public static final int		deficitNoMarket_v4 	= config.getInt("deficitNoMarket_v4");
	
	public static final boolean	isInOutMarketTactics= config.isTrue("isInOutMarketTactics");
	public static final boolean	isIndexInvalid		= config.isTrue("isIndexInvalid");
	public static final boolean	isIndexInvalid_m10	= config.isTrue("isIndexInvalid_m10");
	public static final boolean	isIndexInvalid_m30	= config.isTrue("isIndexInvalid_m30");
	
	public static final boolean	isReInMarketCheck	= config.isTrue("isReInMarketCheck");
	public static final boolean	inMarketCheck_t1	= config.isTrue("inMarketCheck_t1");
	public static final boolean	reInMarketCheck_t2	= config.isTrue("reInMarketCheck_t2");
	public static final int		inMarket_t1 		= config.getInt("inMarket_t1");
	public static final int		inMarket_t2 		= config.getInt("inMarket_t2");
	public static final int		reInMarket_t1 		= config.getInt("reInMarket_t1");
	public static final int		reInMarket_t2 		= config.getInt("reInMarket_t2");
	public static final boolean	inMarket_version	= config.isTrue("inMarket_version");
	public static final boolean	inMarket_dir		= config.isTrue("inMarket_dir");
	public static final boolean	isExistTime			= config.isTrue("isExistTime");
	public static final boolean	isCheckTrend		= config.isTrue("isCheckTrend");
	public static final boolean	isUseTrend			= config.isTrue("isUseTrend");
	public static final boolean	isDvtBreak			= config.isTrue("isDvtBreak");
	public static final boolean	isInMBreak			= config.isTrue("isInMBreak");
	
	public static final boolean	isDbFx				= config.isTrue("isDbFx");
	public static final boolean	isMeFx				= config.isTrue("isMeFx");
	public static final boolean	isFxSave			= config.isTrue("isFxSave");
	public static final int		fx_step03 			= config.getInt("fx_step03");
	public static final int		fx_step04 			= config.getInt("fx_step04");
	
	
	//-- base.xml
	public static final boolean isM05_beili_cond	= base.isTrue("isM05_beili_cond");
	public static final int		m05_ang1 			= base.getInt("m05_ang1");
	public static final int		m05_ang2 			= base.getInt("m05_ang2");
	public static final int		m05_ang3 			= base.getInt("m05_ang3");
	public static final int		m05_kdif1 			= base.getInt("m05_kdif1");
	public static final int		m05_kdif2 			= base.getInt("m05_kdif2");
	public static final int		m05_mdif1 			= base.getInt("m05_mdif1");
	public static final int		m05_mdif2 			= base.getInt("m05_mdif2");
	
	public static final boolean isM10_beili_cond	= base.isTrue("isM10_beili_cond");
	public static final int		m10_ang1 			= base.getInt("m10_ang1");
	public static final int		m10_ang2 			= base.getInt("m10_ang2");
	public static final int		m10_ang3 			= base.getInt("m10_ang3");
	public static final int		m10_kdif1 			= base.getInt("m10_kdif1");
	public static final int		m10_kdif2 			= base.getInt("m10_kdif2");
	public static final int		m10_mdif1 			= base.getInt("m10_mdif1");
	public static final int		m10_mdif2 			= base.getInt("m10_mdif2");
	
	public static final boolean isM30_beili_cond	= base.isTrue("isM30_beili_cond");
	public static final int		m30_ang1 			= base.getInt("m30_ang1");
	public static final int		m30_ang2 			= base.getInt("m30_ang2");
	public static final int		m30_ang3 			= base.getInt("m30_ang3");
	public static final int		m30_kdif1 			= base.getInt("m30_kdif1");
	public static final int		m30_kdif2 			= base.getInt("m30_kdif2");
	public static final int		m30_mdif1 			= base.getInt("m30_mdif1");
	public static final int		m30_mdif2 			= base.getInt("m30_mdif2");
	
	/****
	 *  tactic.xml
	 ***/
	public static final boolean	isTimeRange 		= tactic.isTrue("isTimeRange");
	//--- v1
	public static final int  	timeRange			= tactic.getInt("timeRange");
	public static final int		m30Range 			= tactic.getInt("m30Range");
	public static final int		beiliRange 			= tactic.getInt("beiliRange");
	public static final int		timeRangeM2_v2 		= tactic.getInt("timeRangeM2_v2");
	public static final int		timeRange_v2 		= tactic.getInt("timeRange_v2");
	public static final int		timeRangeM2_v3 		= tactic.getInt("timeRangeM2_v3");
	public static final int		timeRange_v3 		= tactic.getInt("timeRange_v3");
	public static final int		timeRange_v4 		= tactic.getInt("timeRange_v4");
	public static final int		m30Range_v4 		= tactic.getInt("m30Range_v4");
	public static final int		dvtRange_v4 		= tactic.getInt("dvtRange_v4");
	public static final boolean	isAfM30_v4 			= tactic.isTrue("isAfM30_v4");
	public static final int		timeRangeM3_v5 		= tactic.getInt("timeRangeM3_v5");
	public static final int		timeRange_v5 		= tactic.getInt("timeRange_v5");
}
