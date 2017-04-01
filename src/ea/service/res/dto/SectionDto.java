package ea.service.res.dto;

import ea.service.utils.base.Mark;
/**
 * 修改get方法
 * @author Liang.W.William
 */
public class SectionDto {

	//---特征序列
	private int		period;
	
	private int		top_cno;
	private int		bot_cno;
	
	private	String	top_time = null;		//特征序列的顶时间
	private	String	bot_time = null;		//特征序列的底时间
	
	private	double	top_price;				//特征序列的顶价格
	private	double	bot_price;				//特征序列的底价格
	
	final public int getTop_cno() {
		return this.top_cno;
	}
	final public void setTop_cno(int top_cno) {
		this.top_cno = top_cno;
	}
	final public int getBot_cno() {
		return this.bot_cno;
	}
	final public void setBot_cno(int bot_cno) {
		this.bot_cno = bot_cno;
	}
	final public double getTop_price() {
		double price = this.top_price;
		if(this.getTop_time() == null){
			price = Mark.No_Price_Max;
		}
		return price;
	}
	final public void setTop_price(double top_price) {
		this.top_price = top_price;
	}
	final public String getTop_time() {
		return this.top_time;
	}
	final public void setTop_time(String top_time) {
		this.top_time = top_time;
	}
	final public double getBot_price() {
		double price = this.bot_price;
		if(this.getBot_time() == null){
			price = Mark.No_Price_Min;
		}
		return price;
	}
	final public void setBot_price(double bot_price) {
		this.bot_price = bot_price;
	}
	final public String getBot_time() {
		return this.bot_time;
	}
	final public void setBot_time(String bot_time) {
		this.bot_time = bot_time;
	}
	final public int getPeriod() {
		return this.period;
	}
	final public void setPeriod(int period) {
		this.period = period;
	}
}
