package ea.tactics.server;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;

/**
 * 运行计算所有指标
 */
public class ServerIndex {
	private static ServerIndex singleInstance = null;
	long mod_m30;
	private int cno_m05, i_m05, cno_m10, i_m10, cno_m30 = 0, i_m30 = 0;
	private CandlesDto 	dto_cl_m05, dto_cl_m10, dto_cl_m30 = null;
	private FxMacdDto rs = null;
	private int fx_m05 = 80, fx_m10 = 80, fx_m30 = 80;
	
	public static ServerIndex getSingleInstance(){
		if (singleInstance == null) {
			synchronized (ServerIndex.class) {
				if (singleInstance == null) {
					singleInstance = new ServerIndex();
				}
			}
		}
		return singleInstance;
	}
	
	/**
	 * dto_k_01:一分钟k线可能为空
	 */
	final public void runIndex(CandlesDto dto_k_01, long time){
		//if(time >= 20121228220000L){
			//System.out.println("11");
		//}
		this.runEveryMinute(dto_k_01);
		
		if(time%500 == 0){
			this.exeFx_M05(dto_k_01,time);
		}
		
		if(time%1000 == 0){
			this.exeFx_M10(dto_k_01,time);
		}
		
	    this.mod_m30 = time%10000;
		if(this.mod_m30 == 0 || this.mod_m30 == 3000){
			this.exeFx_M30(dto_k_01,time);
			Data.moveManager.clearAllIds();
			Data.breakInMData.clear();
		}
	}
	
	final private void runEveryMinute(CandlesDto dto_k_01){
		if(null == dto_k_01){
			return;
		}
		Data.conditionManager.setDto_k_01(dto_k_01);	// 存储一分钟K线
		
		Data.moveManager.runMoveOutMarket(dto_k_01);	// move out market
		
		this.exe_break(dto_k_01);	
	}
	
	final private void exe_break(CandlesDto dto_k_01){
		
		if(Controller.isDvtBreak){			// 计算是否突破
			Data.breakManager.checkBreak_05(dto_k_01);
			Data.breakManager.checkBreak_10(dto_k_01);
		}
		if(Controller.isInMBreak){
			Data.breakInMData.checkBreak(Mark.Period_M05, dto_k_01);
		}
	}
	
	final private void exeFx_M05(CandlesDto dto_k_01, long time){
		this.dto_cl_m05 = Data.pageManager.getCandlesDtoByTime(Mark.Period_M05, time);
		if(null == dto_k_01 || null == this.dto_cl_m05){
			return;
		}
		this.cno_m05 = this.dto_cl_m05.getCno();
		this.i_m05++;

		if(this.i_m05 < this.cno_m05){
			while(this.i_m05 < this.cno_m05){
				if(Controller.isDbFx){
					this.rs = Data.dBHandler.createFx_M05(this.i_m05);
					Data.beiLiManager_Db.getBeiliDtoByPeriod(Mark.Period_M05, Data.getDataControl.getKdataByCno(Mark.Period_M05, this.i_m05).getTime(), dto_k_01, this.rs);// 计算背离数据	
				}
				//System.out.println(time + " : 补全 M05 Fx----> " + this.i_m05);
				if(Controller.isMeFx){
					this.rs = Data.fxManager.getFxMacdDto(Mark.Period_M05, this.i_m05-this.fx_m05, this.i_m05);
					Data.beiLiManager_Se.getBeiliDtoByPeriod(Mark.Period_M05, Data.getDataControl.getKdataByCno(Mark.Period_M05, this.i_m05).getTime(), dto_k_01, this.rs);	
				}
				this.i_m05++;
			}
		}
		if(null != this.dto_cl_m05){
			if(Controller.isDbFx){
				this.rs = Data.dBHandler.createFx_M05(this.i_m05);	//刷新5分钟fx,
				Data.beiLiManager_Db.getBeiliDtoByPeriod(Mark.Period_M05, this.dto_cl_m05.getTime(), dto_k_01, this.rs);
			}
			//System.out.println(this.i_m05 + " : M05 exe - " + this.dto_cl_m05.getCno() + " : " + this.dto_cl_m05.getTime());
			if(Controller.isMeFx){
				this.rs = Data.fxManager.getFxMacdDto(Mark.Period_M05, this.i_m05-this.fx_m05, this.i_m05);
				Data.beiLiManager_Se.getBeiliDtoByPeriod(Mark.Period_M05, this.dto_cl_m05.getTime(), dto_k_01, this.rs);
			}
		}
	}

	final private void exeFx_M10(CandlesDto dto_k_01, long time){
		this.dto_cl_m10 = Data.pageManager.getCandlesDtoByTime(Mark.Period_M10, time);
		if(null == dto_k_01 || null == this.dto_cl_m10){
			return;
		}
		this.cno_m10 = this.dto_cl_m10.getCno();
		this.i_m10++;
		if(this.i_m10 < this.cno_m10){
			while(this.i_m10 < this.cno_m10){
				if(Controller.isDbFx){
					this.rs = Data.dBHandler.createFx_M10(this.i_m10);
					Data.beiLiManager_Db.getBeiliDtoByPeriod(Mark.Period_M10, Data.getDataControl.getKdataByCno(Mark.Period_M10, this.i_m10).getTime(), dto_k_01, this.rs);// 计算背离数据			
				}	
				//System.out.println(time + " : 补全 M10 Fx----> " + this.i_m10);
				if(Controller.isMeFx){
					this.rs = Data.fxManager.getFxMacdDto(Mark.Period_M10, this.i_m10-this.fx_m10, this.i_m10);
					Data.beiLiManager_Se.getBeiliDtoByPeriod(Mark.Period_M10, Data.getDataControl.getKdataByCno(Mark.Period_M10, this.i_m10).getTime(), dto_k_01, this.rs);
				}
				this.i_m10++;
			}
		}
		if(null != this.dto_cl_m10){
			if(Controller.isDbFx){
				this.rs = Data.dBHandler.createFx_M10(this.i_m10);
				Data.beiLiManager_Db.getBeiliDtoByPeriod(Mark.Period_M10, this.dto_cl_m10.getTime(), dto_k_01, this.rs);	
			}
			//System.out.println(this.i_m10 + " : M10 exe ---> " + this.dto_cl_m10.getCno() + " : " + this.dto_cl_m10.getTime());
			if(Controller.isMeFx){
				this.rs = Data.fxManager.getFxMacdDto(Mark.Period_M10, this.i_m10-this.fx_m10, this.i_m10);
				Data.beiLiManager_Se.getBeiliDtoByPeriod(Mark.Period_M10, Data.getDataControl.getKdataByCno(Mark.Period_M10, this.i_m10).getTime(), dto_k_01, this.rs);
			}		
		}
	}
	
	final private void exeFx_M30(CandlesDto dto_k_01, long time){
		this.dto_cl_m30 = Data.pageManager.getCandlesDtoByTime(Mark.Period_M30, time);
		if(null == dto_k_01 || null == this.dto_cl_m30){
			return;
		}
		this.cno_m30 = this.dto_cl_m30.getCno();
		this.i_m30++;
		if(this.i_m30 < this.cno_m30){
			while(this.i_m30 < this.cno_m30){
				if(Controller.isDbFx){
					this.rs = Data.dBHandler.createFx_M30(this.i_m30);
					Data.beiLiManager_Db.getBeiliDtoByPeriod(Mark.Period_M10, Data.getDataControl.getKdataByCno(Mark.Period_M30, this.i_m30).getTime(), dto_k_01, this.rs);// 计算背离数据
				}
				//System.out.println("补全30Fx----> " + this.i_m30);
				if(Controller.isMeFx){
					this.rs = Data.fxManager.getFxMacdDto(Mark.Period_M30, this.i_m30-this.fx_m30, this.i_m30);
					Data.beiLiManager_Se.getBeiliDtoByPeriod(Mark.Period_M10, Data.getDataControl.getKdataByCno(Mark.Period_M30, this.i_m30).getTime(), dto_k_01, this.rs);
				}
				this.i_m30++;
			}
		}
		if(null != this.dto_cl_m30){
			if(Controller.isDbFx){
				this.rs = Data.dBHandler.createFx_M30(this.i_m30);
				Data.beiLiManager_Db.getBeiliDtoByPeriod(Mark.Period_M30, this.dto_cl_m30.getTime(), dto_k_01, this.rs);
			}
			//System.out.println(this.i_m30 + " : M30 exe - " + this.dto_cl_m30.getCno() + " : " + this.dto_cl_m30.getTime());
			if(Controller.isMeFx){
				this.rs = Data.fxManager.getFxMacdDto(Mark.Period_M30, this.i_m30-this.fx_m30, this.i_m30);
				Data.beiLiManager_Se.getBeiliDtoByPeriod(Mark.Period_M30, this.dto_cl_m30.getTime(), dto_k_01, this.rs);
			}
		}
	}
}
