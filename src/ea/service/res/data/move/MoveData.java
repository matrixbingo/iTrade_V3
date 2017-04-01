package ea.service.res.data.move;

import ea.server.Data;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.MoveParaDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Maths;

public class MoveData {
	
	private int ino = -1, type = Mark.Action_Type_sec;
	private int version	= 0;
	private boolean state = true;				//状态 true:处理中，false：结束
	
	private boolean isRunMoveSell = false, isChangeSell = false, isStartPitSell = false;
	private boolean isRunMoveBuy  = false, isChangeBuy  = false, isStartPitBuy  = false;
	
	private int startMove = 0, margin = 0, stopLoss = 0, startProfit = 0, stopProfit = 0;
	
	private int ipeice_k		= 0;
	private int startRun_sell	= 0;		//start run price
	private int stopLoss_sell	= 0;		//stop loss price
	private int outPrice_sell 	= 0;		//out market price
	private int startPit_sell 	= 0;
	private int stopPfit_sell 	= 0;
	
	private int ipeice_d 		= 0;
	private int startRun_buy	= 0;
	private int stopLoss_buy	= 0;
	private int outPrice_buy 	= 0;
	private int startPit_buy  	= 0;
	private int stopPfit_buy  	= 0;
	
	/**
	 * 初始化移动出场data
	 * @param ino：周期 + CNO
	 */
	public MoveData(int ver, int type, int ino, double iprice){
		MoveParaDto dto 	= Data.moveParaData.getMoveParaDto(ver);
		this.version		= ver;
		this.ino 			= ino;
		this.startMove 		= dto.getStartMove();
		this.margin 		= dto.getMargin();
		this.stopLoss 		= dto.getStopLoss();
		this.startProfit 	= dto.getStartProfit();
		this.stopProfit 	= dto.getStopProfit();
		this.type 			= type;
		switch(type){
			case Mark.Action_Type_Buy 	: this.startMoveBuy(iprice);	
				break;
			case Mark.Action_Type_Sell 	: this.startMoveSell(iprice);
				break;
		}
	}
	
	/**
	 * move sell
	 */
	final private void startMoveSell(double iprice){
		this.ipeice_k = Maths.priceToIntFive(iprice);
		this.startRun_sell = this.ipeice_k - this.startMove;
		this.stopLoss_sell = this.ipeice_k + this.stopLoss;
		this.outPrice_sell = this.ipeice_k + this.margin;
		this.startPit_sell = this.ipeice_k - this.startProfit;
		this.stopPfit_sell = this.ipeice_k - this.stopProfit;
		this.isRunMoveSell = true;
	}

	final public void runMoveSell(CandlesDto dto, int ino){
		if(this.isRunMoveSell){
			int price 	= Maths.priceToIntFive(dto.getLow());
			int oprice 	= Maths.priceToIntFive(dto.getClose());
			if(price <= this.startRun_sell){
				this.isChangeSell = true;
			}
			if(price <= this.startPit_sell){
				this.isStartPitSell = true;
			}
			this.changeSell(price);
			this.startPitSell(dto, price, ino, oprice);
			this.outSell(dto, price, ino, oprice);
		}
	}
	final private void changeSell(int price){
		if(this.isChangeSell){
			if(this.outPrice_sell - price >= this.margin){
				this.outPrice_sell = price + this.margin;
			}
		}
		
	}

	final private void startPitSell(CandlesDto dto, int price, int ino, int oprice){
		if(this.isStartPitSell){
			if(price >= this.stopPfit_sell){
				//EOMarketDBControl.getSingleInstance().outSellOne(this.ino, dto.getTime(), Maths.intToPrivce(this.stopPfit_sell), true);
				this.revertSell(ino);
			}
		}
	}

	final private void outSell(CandlesDto dto, int price, int ino, int oprice){
		if(price >= this.stopLoss_sell){
			//EOMarketDBControl.getSingleInstance().outSellOne(this.ino, dto.getTime(), Maths.intToPrivce(this.stopLoss_sell), true);	//stopLoss_sell
			this.revertSell(ino);
		}
		if(this.isChangeSell && price >= this.outPrice_sell){
			//EOMarketDBControl.getSingleInstance().outSellOne(this.ino, dto.getTime(), Maths.intToPrivce(this.outPrice_sell), true);	//stopLoss_sell
			this.revertSell(ino);
		}
	}

	final private void revertSell(int ino){
		this.isRunMoveSell 	= false;
		this.isChangeSell 	= false;
		this.isStartPitSell = false;
		this.state			= false;
		Data.moveManager.addRemoveIds(ino);	//添加id，统一删除
	}
	
	/**
	 * move buy
	 */
	final private void startMoveBuy(double iprice){
		this.ipeice_d = Maths.priceToIntFive(iprice);
		this.startRun_buy = this.ipeice_d + this.startMove;
		this.stopLoss_buy = this.ipeice_d - this.stopLoss;
		this.outPrice_buy = this.ipeice_d - this.margin;
		this.startPit_buy = this.ipeice_d + this.startProfit;
		this.stopPfit_buy = this.ipeice_d + this.stopProfit;
		this.isRunMoveBuy = true;
	}

	final public void runMoveBuy(CandlesDto dto, int ino){
		if(this.isRunMoveBuy){
			int price 	= Maths.priceToIntFive(dto.getHigh());
			int oprice 	= Maths.priceToIntFive(dto.getClose());
			if(price >= this.startRun_buy){
				this.isChangeBuy = true;
			}
			if(price >= this.startPit_buy){
				this.isStartPitBuy = true;
			}
			this.changeBuy(price);
			this.startPitBuy(dto, price, ino, oprice);
			this.outBuy(dto, price, ino, oprice);
		}
	}
	final private void changeBuy(int price){
		if(this.isChangeBuy){
			if(price - this.outPrice_buy >= this.margin){
				this.outPrice_buy = price - this.margin;
			}
		}
	}

	final private void startPitBuy(CandlesDto dto, int price, int ino, int oprice){
		if(this.isStartPitBuy){
			if(price <= this.stopPfit_buy){
				//EOMarketDBControl.getSingleInstance().outBuyOne(this.ino, dto.getTime(), Maths.intToPrivce(this.stopPfit_buy), true);
				this.revertBuy(ino);
			}
		}
	}

	final private void outBuy(CandlesDto dto, int price, int ino, int oprice){
		if(price <= this.stopLoss_buy){
			//EOMarketDBControl.getSingleInstance().outBuyOne(this.ino, dto.getTime(), Maths.intToPrivce(this.stopLoss_buy), true);	//stopLoss_buy
			this.revertBuy(ino);
		}
		if(this.isChangeBuy && price <= this.outPrice_buy){
			//EOMarketDBControl.getSingleInstance().outBuyOne(this.ino, dto.getTime(), Maths.intToPrivce(this.outPrice_buy), true);	//stopLoss_buy
			this.revertBuy(ino);
		}
	}

	final private void revertBuy(int ino){
		this.isRunMoveBuy 	= false;
		this.isChangeBuy 	= false;
		this.isStartPitBuy  = false;
		this.state			= false;
		Data.moveManager.addRemoveIds(ino);	//添加id，统一删除
	}
	
	final public int getVersion() {
		return version;
	}
/*	final public void setVersion(int version) {
		this.version = version;
	}*/
	final public int getIno() {
		return this.ino;
	}
	final public boolean getState(){
		return this.state;
	}
	final public int getType(){
		return this.type;
	}
}
