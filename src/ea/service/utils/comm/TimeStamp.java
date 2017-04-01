package ea.service.utils.comm;

import org.apache.commons.lang.time.StopWatch;

public class TimeStamp {

	private StopWatch clock = null;
	private static TimeStamp singleInstance = null; //唯一实例
	
	public static TimeStamp getSingleInstance(){
		if (singleInstance == null) {
			synchronized (TimeStamp.class) {
				if (singleInstance == null) {
					singleInstance = new TimeStamp();
				}
			}
		}
		return singleInstance;
	}
	private TimeStamp(){
		this.clock = new StopWatch();
		this.start();
	}
	final private void start(){
		try{
			this.clock.start(); //计时开始
		}catch(IllegalStateException e){
			//already start  do nothing
		}
	}
	final public String stop(){
		this.clock.stop();  //计时结束
		return this.format(this.clock.getTime());
	}
	
	/**
	 * 将毫秒数换算成x天x时x分x秒x毫秒
	 */
	final private String format(long ms) {
		int ss = 1000;
		int mi = ss * 60;
		int hh = mi * 60;
		int dd = hh * 24;

		long day = ms / dd;
		long hour = (ms - day * dd) / hh;
		long minute = (ms - day * dd - hour * hh) / mi;
		long second = (ms - day * dd - hour * hh - minute * mi) / ss;
		long milliSecond = ms - day * dd - hour * hh - minute * mi - second * ss;

		String strDay = day < 10 ? "0" + day : "" + day;
		String strHour = hour < 10 ? "0" + hour : "" + hour;
		String strMinute = minute < 10 ? "0" + minute : "" + minute;
		String strSecond = second < 10 ? "0" + second : "" + second;
		String strMilliSecond = milliSecond < 10 ? "0" + milliSecond : "" + milliSecond;
		strMilliSecond = milliSecond < 100 ? "0" + strMilliSecond : "" + strMilliSecond;
		return (strDay + " " + strHour + ":" + strMinute + ":" + strSecond + " " + strMilliSecond).replaceAll("-", "");
	}
}
