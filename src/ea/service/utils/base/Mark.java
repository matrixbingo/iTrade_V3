package ea.service.utils.base;

public class Mark {
	public static final String	SYMBOL_EURUSD			= "EURUSD";
	
	//--- 趋势类型
	public static final int		Trend_Shock				= 0;
	public static final int		Trend_Rise				= 1;
	public static final int		Trend_Fall				= 2;
	
	//--- 背离类型
	public static final int		Beili_Top				=  1;				//不能和突破一样
	public static final int		Beili_Bot				= -1;				//原来是2
	public static final int		Beili_Dir_1				=  1;				//dev 1
	public static final int		Beili_Dir_2				=  2;				//dev 2
	public static final int		Beili_No				=  0;				//不是背离
	
	//---突破类型
	public static final int		Break_Top				=  1;				//不能和突破一样
	public static final int		Break_Bot				= -1;
	public static final int		Break_Dir_1				=  1;				//break 1
	public static final int		Break_Dir_2				=  2;				//break 2
	public static final int		Break_No				=  0;				//不是breal
	
	//--分笔高低点类型
	public static final int		From_Top				=  1;				//第一个点是高点
	public static final int		From_Btm				= -1;				//第一个点是低点
	
	//--分笔类型
	public static final int 	Fx_Db					=  1;
	public static final int 	Fx_Me					= -1;
	
	public static final int 	Fx_Dvt					= 0;				//背离：显示类别
	public static final int 	Fx_Brk					= 1;				//突破：显示类别
	public static final int 	Fx_Bth					= 3;				//背离 & 突破

	//---周期类型
	public static final int		Period_M01				= 1;
	public static final int		Period_M03				= 3;
	public static final int		Period_M05				= 5;
	public static final int		Period_M10				= 10;
	public static final int		Period_M15				= 15;
	public static final int		Period_M30				= 30;
	public static final int		Period_H01				= 60;
	public static final int		Period_H04				= 240;
	
	//--- t_remark
	public static final int		Action_Type_beili		=  1;				//背离判断
	public static final int		Action_Type_break		= -1;				//突破判断
		
	public static final int		Action_out_1			= 1;				//out 1
	public static final int		Action_out_2			= 2;				//out 2
	
	public static final int		Action_Dir_BreakTop_1	=  3;				//上突破1
	public static final int		Action_Dir_BreakBot_1	= -3;				//下突破1
	public static final int		Action_Dir_BreakTop_2	=  4;				//上突破2
	public static final int		Action_Dir_BreakBot_2	= -4;				//下突破2
	
	public static final int		Action_Type_sec			=  0;				//特征序列
	public static final int		Action_Dir_Sec_ET		=  5;				//前顶
	public static final int		Action_Dir_Sec_EB		= -5;				//前底
	
	//-- isMoveOutMarket
	public static final int		startMove				= 1;
	public static final int		margin					= 2;
	public static final int		stopLoss				= 3;
	public static final int		startProfit				= 4;
	public static final int		stopProfit				= 5;
	
	//--- t_order 状态 0: 处理中, 1:处理完成, 2:废止
	public static final int		Order_state_ing			= 0;				//
	public static final int		Order_state_end			= 1;				//
	public static final int		Order_state_abn			= 2;				//
	//--监听出场状态
	public static final int		OutMarket_No			=  0;				//无状态
	public static final int		OutMarket_1				=  1;				//亏损出场，盈利走移动出场
	public static final int		OutMarket_2				=  2;				//亏损出场，盈利不出场
	
	//--- t_order
	public static final int		Action_Type_Sell		= -1;				//空
	public static final int		Action_Type_Buy			=  1;				//多
	
	public static final int		Order_Dir_v01			= 1;				//k1, d1
	public static final int		Order_Dir_v02			= 2;				//k2, d2
	public static final int		Order_Dir_v03			= 3;				//k3, d3
	public static final int		Order_Dir_v04			= 4;				//k3, d3
	public static final int		Order_Dir_v05			= 5;
	public static final int		Order_Dir_v06			= 6;
	
	//--- 各个版本
	public static final int		Version_v01				= 1;				
	public static final int		Version_v02				= 2;
	public static final int		Version_v03				= 3;
	public static final int		Version_v04				= 4;
	public static final int		Version_v05				= 5;

	//--- 其他常量
	public static final double	No_Price_Min			= -100;				//不存在的低价
	public static final double	No_Price_Max			=  100;				//不存在的高价
	public static final Integer	No_Cno					= -1;				//不存在的CNO
	public static final long	No_Time					=  0;				//不存在的时间
	public static final int		No_Period				= -1;
	public static final int		No_Dir					=  0;

	//--- 序列化 xml
	public static final String 	ConditionData_xml 		= "ConditionData.xml";

}