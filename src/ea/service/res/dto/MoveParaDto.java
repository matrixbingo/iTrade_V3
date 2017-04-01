package ea.service.res.dto;

public class MoveParaDto {
	
	private int startMove = 0;
	private int margin = 0;
	private int stopLoss = 0;
	private int startProfit = 0;
	private int stopProfit = 0;
	
	final public int getStartMove() {
		return startMove;
	}
	final public void setStartMove(int startMove) {
		this.startMove = startMove;
	}
	final public int getMargin() {
		return margin;
	}
	final public void setMargin(int margin) {
		this.margin = margin;
	}
	final public int getStopLoss() {
		return stopLoss;
	}
	final public void setStopLoss(int stopLoss) {
		this.stopLoss = stopLoss;
	}
	final public int getStartProfit() {
		return startProfit;
	}
	final public void setStartProfit(int startProfit) {
		this.startProfit = startProfit;
	}
	final public int getStopProfit() {
		return stopProfit;
	}
	final public void setStopProfit(int stopProfit) {
		this.stopProfit = stopProfit;
	}

}
