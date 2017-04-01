package ea.service.res.period;

import ea.service.utils.base.Mark;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;

public class Util {
	//private static Logger log = LoggerFactory.getLogger(Util.class);
	public final static String TIME = "yyyy-MM-dd HH:mm:ss";
	public final static String Calendar2Str = "yyyyMMddHHmmss";
	public final static int TimeZone_M5 = 5;
	public final static int TimeZone_M10 = 10;
	public final static int TimeZone_M30 = 30;
	public final static int TimeZone_M60 = 60;
	public final static int TimeZone_M240 = 240;
	
	/**
	 * 得到list的最值
	 * @param list
	 * @return 数组 1:最大值 2:最小值
	 */
	public static double[] getPriceMost(ArrayList<Double> list){
		double[] d = new double[2];
		d[0] = Collections.max(list);
		d[1] = Collections.min(list);
		return d;
	}
	/**
	 * String转换成date
	 * @param time
	 * @return
	 */
	public static Date str2Date(String time){
		Date date = null;
		if(time != null){
			DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");//yyyy-MM-dd HH:mm:ss
			try {
			    date = format.parse(time);
			} catch (Exception e) {
			    e.printStackTrace();
			}
		}
		return date;
	}
	
	/**
	 * String转换成Calendar
	 * @param time
	 * @return
	 */
	public static Calendar str2Calendar(String time){
		Calendar cal = Calendar.getInstance();
		Date date = null;
		if(time != null){
			DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");//yyyy-MM-dd HH:mm:ss
			try {
			    date = format.parse(time);
			    cal.setTime(date);
			} catch (Exception e) {
			    e.printStackTrace();
			}
		}
		return cal;
	}
	/**
	 * Calendar转换成String , 格式化输出日期
	 * @param a
	 * @return
	 */
	public static String calendar2Str(Calendar a,String format){
		SimpleDateFormat df = new SimpleDateFormat(format);
		return df.format(a.getTime());	
	}
	
	public static String formatStr(String time){
		return Util.calendar2Str(Util.str2Calendar(time), Util.TIME);
	}

	/**
	 * 得到M5时间区间
	 * @return
	 */
	public static String[] getTimeZone_M5(int minute){
		String[] in = new String[2];
		if(minute >= 0 && minute <= 5){
			in[0] = "00";
			in[1] = "05";
		}else if(minute > 5 && minute <= 10){
			in[0] = "05";
			in[1] = "10";
		}else if(minute > 10 && minute <= 15){
			in[0] = "10";
			in[1] = "15";
		}else if(minute > 15 && minute <= 20){
			in[0] = "15";
			in[1] = "20";
		}else if(minute > 20 && minute <= 25){
			in[0] = "20";
			in[1] = "25";
		}else if(minute > 25 && minute <= 30){
			in[0] = "25";
			in[1] = "30";
		}else if(minute > 30 && minute <= 35){
			in[0] = "30";
			in[1] = "35";
		}else if(minute > 35 && minute <= 40){
			in[0] = "35";
			in[1] = "40";
		}else if(minute > 40 && minute <= 45){
			in[0] = "40";
			in[1] = "45";
		}else if(minute > 45 && minute <= 50){
			in[0] = "45";
			in[1] = "50";
		}else if(minute > 50 && minute <= 55){
			in[0] = "50";
			in[1] = "55";
		}else if(minute > 55 && minute <= 60){
			in[0] = "55";
			in[1] = "60";
		}
		return in;
	}
	/**
	 * 得到M5的结束时间
	 */
	public static Calendar getEndZoneByPeriod(Calendar a, int timeZone){
		int m1 = a.get(Calendar.MINUTE);
		String[] mins = Util.getTimeZone_M5(m1);
		switch(timeZone){
			case Util.TimeZone_M10 : mins = Util.getTimeZone_M10(m1);
				break;
			case Util.TimeZone_M30 : mins = Util.getTimeZone_M30(m1);
				break;
			case Util.TimeZone_M60 : mins = Util.getTimeZone_M60(m1);
				break;
		}
		if("60".equals(mins[1])){
			a.add(Calendar.HOUR_OF_DAY, 1);
			mins[1] = "00";
		}
		if(m1 == 0){
			mins[1] = "00";
		}
		int month = a.get(Calendar.MONTH) + 1;
		int day_of_month = a.get(Calendar.DAY_OF_MONTH);
		int hout_of_day = a.get(Calendar.HOUR_OF_DAY);
		
		String mon = (month < 10)?"0" + month : month + "";
		String day = (day_of_month < 10)?"0"+day_of_month:day_of_month+"";
		String hour = (hout_of_day < 10)?"0"+hout_of_day:hout_of_day+"";
		String end = a.get(Calendar.YEAR) + mon + day + hour + mins[1] + "00";
		//System.out.println(mins[0] + " - " + mins[1]);
		//System.out.println(end);
		return Util.str2Calendar(end);
	}
	public static Calendar getHourEndZoneByPeriod(Calendar a, int timeZone){
		int h = a.get(Calendar.HOUR_OF_DAY);
		String[] hours = Util.getTimeZone_M5(h);
		switch(timeZone){
			case Util.TimeZone_M240 : hours = Util.getTimeZone_M240(h);
				break;
		}
		if("00".equals(hours[1])){
			a.add(Calendar.HOUR_OF_DAY, 1);
		}
		
		int month = a.get(Calendar.MONTH) + 1;
		int day_of_month = a.get(Calendar.DAY_OF_MONTH);
		int hout_of_day = a.get(Calendar.HOUR_OF_DAY);
		
		String mon = (month < 10)?"0" + month : month + "";
		String day = (day_of_month < 10)?"0"+day_of_month:day_of_month+"";
		String hour = (hout_of_day < 10)?"0"+hout_of_day:hout_of_day+"";
		String end = a.get(Calendar.YEAR) + mon + day + hour + "0000";
		//System.out.println(mins[0] + " - " + mins[1]);
		
		//System.out.println(end);
		return Util.str2Calendar(end);
	}
	/**
	 * 根据周期类型得到M5,M10,M30,M60的开始时间区间
	 */
	public static Calendar[] getBeginZoneByPeriod(Calendar a, int timeZone){
		Calendar[] znoes = new Calendar[2];
		int m1 = a.get(Calendar.MINUTE);
		String[] mins = Util.getTimeZone_M5(m1);
		
		switch(timeZone){
			case Util.TimeZone_M5 	: mins = Util.getTimeZone_M5(m1);
				break;
			case Util.TimeZone_M10 	: mins = Util.getTimeZone_M10(m1);
				break;
			case Util.TimeZone_M30 	: mins = Util.getTimeZone_M30(m1);
				break;
			case Util.TimeZone_M60 	: mins = Util.getTimeZone_M60(m1);
				break;
		}
		
		int month = a.get(Calendar.MONTH)+1;
		int day_of_month = a.get(Calendar.DAY_OF_MONTH);
		int hout_of_day = a.get(Calendar.HOUR_OF_DAY);
		
		String mon = (month < 10)?"0"+month:month+"";
		String day = (day_of_month < 10)?"0"+day_of_month:day_of_month+"";
		String hour = (hout_of_day < 10)?"0"+hout_of_day:hout_of_day+"";
		
		String begin = a.get(Calendar.YEAR) + mon + day + hour + mins[0] + "01";
		
		if("60".equals(mins[1])){
			a.add(Calendar.HOUR_OF_DAY, 1);
			mins[1] = "00";
		}
		month = a.get(Calendar.MONTH)+1;
		day_of_month = a.get(Calendar.DAY_OF_MONTH);
		hout_of_day = a.get(Calendar.HOUR_OF_DAY);
		
		mon = (month < 10)?"0"+month:month+"";
		day = (day_of_month < 10)?"0"+day_of_month:day_of_month+"";
		hour = (hout_of_day < 10)?"0"+hout_of_day:hout_of_day+"";

		String end = a.get(Calendar.YEAR) + mon + day + hour + mins[1] + "00";
		znoes[0] = Util.str2Calendar(begin);
		znoes[1] = Util.str2Calendar(end);
		
		//System.out.println(begin + " - " + end);
		return znoes;
	}
	/**
	 * 同上 小时单位
	 */
	public static Calendar[] getHourBeginZoneByPeriod(Calendar a, int timeZone){
		Calendar[] znoes = new Calendar[2];
		int h = a.get(Calendar.HOUR_OF_DAY);
		String[] hours = null;
		
		switch(timeZone){
			case Util.TimeZone_M240 	: hours = Util.getTimeZone_M240(h);
				break;
		}
		
		int month = a.get(Calendar.MONTH) + 1;
		int day_of_month = a.get(Calendar.DAY_OF_MONTH);
		
		String mon = (month < 10)?"0"+month:month+"";
		String day = (day_of_month < 10)?"0"+day_of_month:day_of_month+"";

		String begin = a.get(Calendar.YEAR) + mon + day + hours[0] + "0000";
		
		if("00".equals(hours[1])){
			a.add(Calendar.HOUR_OF_DAY, 1);
		}
		month = a.get(Calendar.MONTH) + 1;
		day_of_month = a.get(Calendar.DAY_OF_MONTH);
		int hout_of_day = a.get(Calendar.HOUR_OF_DAY);
		
		mon = (month < 10)?"0"+month:month+"";
		day = (day_of_month < 10)?"0"+day_of_month:day_of_month+"";
		String hour = (hout_of_day < 10)?"0"+hout_of_day:hout_of_day+"";
		
		String end = a.get(Calendar.YEAR) + mon + day + hour + "0000";
		znoes[0] = Util.str2Calendar(begin);
		znoes[1] = Util.str2Calendar(end);
		
		//System.out.println(begin + " - " + end);
		return znoes;
	}
	/**
	 * 得到M10时间区间
	 */
	public static String[] getTimeZone_M10(int minute){
		String[] in = new String[2];
		if(minute >= 0 && minute <= 10){
			in[0] = "00";
			in[1] = "10";
		}else if(minute > 10 && minute <= 20){
			in[0] = "10";
			in[1] = "20";
		}else if(minute > 20 && minute <= 30){
			in[0] = "10";
			in[1] = "30";
		}else if(minute > 30 && minute <= 40){
			in[0] = "30";
			in[1] = "40";
		}else if(minute > 40 && minute <= 50){
			in[0] = "40";
			in[1] = "50";
		}else if(minute > 50 && minute <= 60){
			in[0] = "50";
			in[1] = "60";
		}
		return in;
	}
	/**
	 * 得到M30时间区间
	 */
	public static String[] getTimeZone_M30(int minute){
		String[] in = new String[2];
		if(minute >= 0 && minute <= 30){
			in[0] = "00";
			in[1] = "30";
		}else if(minute > 30 && minute <= 60){
			in[0] = "30";
			in[1] = "60";
		}
		return in;
	}
	/**
	 * 得到M60时间区间
	 */
	public static String[] getTimeZone_M60(int minute){
		String[] in = new String[2];
		in[0] = "00";
		in[1] = "60";
		return in;
	}
	/**
	 * 得到M240时间区间
	 */
	public static String[] getTimeZone_M240(int hour){
		String[] in = new String[2];
		if(hour > 0 && hour <= 4){
			in[0] = "00";
			in[1] = "04";
		}else if(hour > 4 && hour <= 8){
			in[0] = "04";
			in[1] = "08";
		}else if(hour > 8 && hour <= 12){
			in[0] = "08";
			in[1] = "12";
		}else if(hour > 12 && hour <= 16){
			in[0] = "12";
			in[1] = "16";
		}else if(hour > 16 && hour <= 20){
			in[0] = "16";
			in[1] = "20";
		}else if((hour > 20 && hour <= 24) || hour == 0){	//加一天
			in[0] = "20";
			in[1] = "00";
		}
		return in;
	}
	/**
	 * 得到当前的精确时间 
	 */
	public static String getCurrTime(){
		Calendar rightNow = Calendar.getInstance();	  
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy MM-dd HH:mm:ss SSS");
        return fmt.format(rightNow.getTime());
	}
	/**
	 * 根据周期得到表名
	 */
	public static String getTabNameByPeriod(int period){
		String tab = "t_candle";
		if(Mark.Period_M05 == period){
			tab = "t_candle_05";
		}else if(Mark.Period_M10 == period){
			tab = "t_candle_10";
		}else if(Mark.Period_M30 == period){
			tab = "t_candle_30";
		}else if(Mark.Period_H01 == period){
			tab = "t_candle_60";
		}else if(Mark.Period_H04 == period){
			tab = "t_candle_240";
		}
		return tab;
	}
	/**
	 * 根据周期得到存储过程名称
	 */
	public static String getProcedureByPeriod(int period){
		String procedure = "{call clr_set(1,?)}";
		if(period == Mark.Period_M05){
			procedure = "{call clr_set(5,?)}";
		}else if(period == Mark.Period_M10){
			procedure = "{call clr_set(10,?)}";
		}else if(period == Mark.Period_M30){
			procedure = "{call clr_set(30,?)}";
		}else if(period == Mark.Period_H01){
			procedure = "{call clr_set(60,?)}";
		}
		return procedure;
	}
	/**
	 * 得到对应周期的K线时间
	 */
	public static String getKTimeByPeriod(String time,int period){
		Calendar a = Util.str2Calendar(time);
		Calendar b = Util.getEndZoneByPeriod(a,period);
		time = Util.calendar2Str(b,Util.Calendar2Str);
		return time;
	}
	/**
	 * 根据结束时间和小时差值，得到开始时间:未使用
	 */
	public static String getMinusTimeByHour(String endTime, int timeRange){
		Calendar a = Util.str2Calendar(endTime);
		a.add(Calendar.HOUR, -timeRange);
		endTime = Util.calendar2Str(a,Util.Calendar2Str);
		return endTime;
	}
	/**
	 * 判断日期t1在t2后
	 */
	public static boolean isAfter(String time1, String time2){
		Calendar a = Util.str2Calendar(time1);
		Calendar b = Util.str2Calendar(time2);
		return a.after(b);
	}
	/**
	 * 两个时间差的分钟内数
	 * @param time1
	 * @param time2
	 * @return
	 */
	public static int difHour(String time1, String time2){
		Calendar a = Util.str2Calendar(time1);
		Calendar b = Util.str2Calendar(time2);
		long as = a.getTimeInMillis();
		long bs = b.getTimeInMillis();
		int rs = (int)(bs-as)/(1000*60);
		return rs;
	}
	/*
	 * 得到当前时间：精确到毫秒
	 */
	public static String getCurTime(){
		Calendar rightNow = Calendar.getInstance();	  
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss SSS");
        String sysDatetime = fmt.format(rightNow.getTime());
        return sysDatetime;
	}
	//测试开始的时间区间
	public static void testBeginTimeZone(){
		Calendar a = Util.str2Calendar("20110830230901");	//测试用
		System.out.println(Util.calendar2Str(a,Util.TIME));
		
		Calendar[] znoes = Util.getBeginZoneByPeriod(a,Util.TimeZone_M60);
		Calendar t1 = znoes[0];
		Calendar t2 = znoes[1];
		System.out.println(Util.calendar2Str(t1,Util.TIME) + " <---> " + Util.calendar2Str(t2,Util.TIME));
	}
	//测试结束的时间区间
	public static void testEndTimeZone(){
		Calendar a = Util.str2Calendar("20110830225901");	//测试用
		System.out.println(Util.calendar2Str(a,Util.TIME));
		
		Calendar b = Util.getEndZoneByPeriod(a,Util.TimeZone_M60);
		
		System.out.println(Util.calendar2Str(b,Util.TIME));
	}

	public static void main(String[] args){
		
//		System.out.println(isAfter("20110101015901", "20110101015900"));
//		System.out.println(getMinusTimeByHour("20110101015901", 11));
//		getKTimeByPeriod("20110830015901",Mark.Period_H1);
//		System.out.println(difHour("20110101015901","20110101025901"));
		
		
		/*Calendar a = Util.str2Calendar("20120102080000");
		Calendar[] c = getHourBeginZoneByPeriod(a, 240);
		System.out.println(Util.calendar2Str(c[0],Util.TIME) + " : " + Util.calendar2Str(c[1], Util.TIME));


		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH");
		System.out.println(fmt.format(calendar.getTime()));*/
	}
}