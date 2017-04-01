package ea.server;

import ea.service.res.data.indicator.KDDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.TimeStamp;

/**
 * 计算指标
 */
public class CreatIndicator {
	private int cno = 0;
	private KDDto kdDto;
	/**
	 * 计算全年指标
	 */
	final public void creatIndicator(){
		this.cno = Data.dBHandler.getCno("t_candle_30");
		for(int i=1 ; i<= this.cno ; i++){
			//Data.exeDataControl.exeSql("call idx_macd(" + Mark.Period_M30 + "," + i + ")");
			
			
		}
		
//		this.cno = Data.dBHandler.getCno("t_candle_10");
//		for(int i=1 ; i<=this.cno ; i++){
//			Data.exeDataControl.exeSql("call idx_macd(" + Mark.Period_M10 + "," + i + ")");
//		}
//		
//		this.cno = Data.dBHandler.getCno("t_candle_05");
//		for(int i=1 ; i<=this.cno ; i++){
//			Data.exeDataControl.exeSql("call idx_macd(" + Mark.Period_M05 + "," + i + ")");
//		}
		
		
	}
	
	/**
	 * 实时刷新
	 */
	final private void creatMacdCurr(){
		int i = Data.dBHandler.getMaxNum("t_candle_05");
		Data.exeDataControl.exeSql("call idx_macd(" + Mark.Period_M05 + "," + i + ")");
		
		i = Data.dBHandler.getMaxNum("t_candle_10");
		Data.exeDataControl.exeSql("call idx_macd(" + Mark.Period_M10 + "," + i + ")");
		
		i = Data.dBHandler.getMaxNum("t_candle_30");
		Data.exeDataControl.exeSql("call idx_macd(" + Mark.Period_M30 + "," + i + ")");
	}
	
	final private void creatKDCurr(){
		
		Data.kd.creatKD(Mark.Period_M10);
		
		Data.kd.creatKD(Mark.Period_M30);
		
		Data.kd.creatKD(Mark.Period_H01);
    	
	}
	
	/**
	 * 实时刷新
	 */
	final public void creatIndicatorCurr(){
		
		this.creatMacdCurr();
		
		this.creatKDCurr();
	}

	
	public static void main(String[] args) {
		CreatIndicator creatIndex = new CreatIndicator();
		//CheckCandles c = new CheckCandles();
		//Data.exeDataControl.exeSql("TRUNCATE t_macd");
		//Data.exeDataControl.exeSql("TRUNCATE t_stoptime");
		//Data.exeDataControl.exeSql("TRUNCATE t_misData");
		//Data.dBHandler.changeEngine("MEMORY");
		TimeStamp t = TimeStamp.getSingleInstance();
		
		//c.checkDealTimes(Controller.YEAR);
		creatIndex.creatIndicator();
		
		String runtime = t.stop();
		Data.dBHandler.changeEngine("InnoDB");
		System.out.println("程序运行时间： " + runtime);
	}
}
