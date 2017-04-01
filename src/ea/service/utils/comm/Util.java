package ea.service.utils.comm;

import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.KlinesDto;
import ea.service.utils.base.Mark;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

final public class Util {
    //private static Logger log = LoggerFactory.getLogger(Util.class);
    final public static String TIME = "yyyy-MM-dd HH:mm:ss";
    final public static String Calendar2Str = "yyyyMMddHHmmss";
    private static Calendar a = null, b = null;

    /**
     * 得到list的最值
     *
     * @param list
     * @return 数组 1:最大值 2:最小值
     */
    final public static double[] getPriceMost(ArrayList<Double> list) {
        double[] d = new double[2];
        d[0] = Collections.max(list);
        d[1] = Collections.min(list);
        return d;
    }

    /**
     * String转换成date
     *
     * @param time
     * @return
     */
    final public static Date str2Date(String time) {
        Date date = null;
        if (time != null) {
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
     */
    final public static Calendar str2Calendar(String time) {
        Calendar cal = Calendar.getInstance();
        Date date = null;
        if (null != time && time.length() > 5) {
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

    final public static Calendar lng2Calendar(long time) {
        return str2Calendar(String.valueOf(time));
    }

    /**
     * Calendar转换成String , 格式化输出日期
     */
    final public static String calendar2Str(Calendar a, String format) {
        SimpleDateFormat df = new SimpleDateFormat(format);
        return df.format(a.getTime());
    }

    /**
     * Calendar转换成long
     */
    final public static long calendar2Lng(Calendar a) {
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
        return Long.valueOf(df.format(a.getTime()));
    }

    final public static String formatStr(String time) {
        return Util.calendar2Str(Util.str2Calendar(time), Util.TIME);
    }

    final public static String formatLng(long time) {
        return Util.calendar2Str(Util.lng2Calendar(time), Util.TIME);
    }

    /**
     * 得到当前的精确时间
     */
    final public static String getCurrTime() {
        Calendar rightNow = Calendar.getInstance();
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy MM-dd HH:mm:ss SSS");
        return fmt.format(rightNow.getTime());
    }

    /**
     * 根据周期得到表名
     */
    final public static String getTabNameByPeriod(int period) {
        switch (period) {
            case Mark.Period_M01:
                return "t_candle";
            case Mark.Period_M05:
                return "t_candle_05";
            case Mark.Period_M10:
                return "t_candle_10";
            case Mark.Period_M30:
                return "t_candle_30";
            case Mark.Period_H01:
                return "t_candle_60";
            case Mark.Period_H04:
                return "t_candle_240";
        }
        return null;
    }

    /**
     * 根据结束时间和小时差值，得到开始时间:未使用
     */
    final public static String getMinusTimeByHour(String endTime, int timeRange) {
        Calendar a = Util.str2Calendar(endTime);
        a.add(Calendar.HOUR, -timeRange);
        endTime = Util.calendar2Str(a, Util.Calendar2Str);
        return endTime;
    }
    /**
     * 判断日期t1在t2后

     final public static boolean isAfter(Calendar a, Calendar b){
     return a.after(b);
     }
     final public static boolean isAfter(long time_1, long time_2){
     a = Util.lng2Calendar(time_1);
     b = Util.lng2Calendar(time_2);
     return a.after(b);
     }*/
    /**
     * 判断time是否在bin和end之间,闭区间检验
     */
    final public static boolean isTimeBetweenClose(long time, long bin, long end) {
        if (time >= bin && time <= end) {
            return true;
        }
        return false;
    }

    /**
     * 判断time是否在bin和end之间,开区间检验
     */
    final public static boolean isTimeBetweenOpen(long time, long bin, long end) {
        if (time > bin && time < end) {
            return true;
        }
        return false;
    }

    /**
     * 两个时间差的分钟数
     *
     * @param time1
     * @param time2
     * @return
     */
    final public static int difMinutes(long time1, long time2) {
        a = Util.lng2Calendar(time1);
        b = Util.lng2Calendar(time2);
        long as = a.getTimeInMillis();
        long bs = b.getTimeInMillis();
        int rs = (int) Math.abs((bs - as)) / (1000 * 60);
        return rs;
    }

    /*
     * 得到当前时间：精确到毫秒
     */
    final public static String getCurTime() {
        Calendar rightNow = Calendar.getInstance();
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss SSS");
        String sysDatetime = fmt.format(rightNow.getTime());
        return sysDatetime;
    }

    final public static boolean isDivisible(int period, long time) {
        int b = 33;
        switch (period) {
            case Mark.Period_M01:
                b = 100;
                break;
            case Mark.Period_M05:
                b = 500;
                break;
            case Mark.Period_M10:
                b = 1000;
                break;
            case Mark.Period_M30:
                b = 3000;
                break;
            case Mark.Period_H01:
                b = 6000;
                break;
            case Mark.Period_H04:
                b = 24000;
                break;
        }
        if (time % b == 0) {
            return true;
        }
        return false;
    }

    /**
     * 指定文件追加写入
     *
     * @param url
     * @param str
     */
    final public static void writer(String url, String str) {
        PrintStream p = null;
        try {
            //无覆盖追加
            p = new PrintStream(new BufferedOutputStream(new FileOutputStream(url, true)));
            p.println(str); // 向c:/b.txt写入"门朝大海"
        } catch (IOException e) {
            System.out.println(e);
        } finally {
            if (p != null) {
                p.close();
            }
        }
    }

    final public static int getDev_id_dvt(int period, int cno) {
        switch (period) {
            case Mark.Period_M05:
                return Integer.valueOf(new StringBuffer().append(50).append(cno).toString());
            case Mark.Period_M10:
                return Integer.valueOf(new StringBuffer().append(10).append(cno).toString());
            case Mark.Period_M30:
                return Integer.valueOf(new StringBuffer().append(30).append(cno).toString());
            case Mark.Period_H01:
                return Integer.valueOf(new StringBuffer().append(60).append(cno).toString());
            case Mark.Period_H04:
                return Integer.valueOf(new StringBuffer().append(240).append(cno).toString());
        }
        return 0;
    }

    /**
     * 按k的cno正序排序
     */
    final public static void sort(List<CandlesDto> list) {
        Collections.sort(list, new Comparator<CandlesDto>() {
            @Override
            final public int compare(CandlesDto o1, CandlesDto o2) {
                int i = o1.getCno();
                int j = o2.getCno();
                if (i > j)
                    return 1;    //正序 return 1
                else if (i <= j)
                    return -1;    //正序 return -1
                return 0;
            }
        });
    }

    /**
     * 按k的cno正序排序
     */
    final public static void sortDesc(List<CandlesDto> list) {
        Collections.sort(list, new Comparator<CandlesDto>() {
            @Override
            final public int compare(CandlesDto o1, CandlesDto o2) {
                int i = o1.getCno();
                int j = o2.getCno();
                if (i > j)
                    return -1;    //正序 return 1
                else if (i <= j)
                    return 1;    //正序 return -1
                return 0;
            }
        });
    }

    /**
     * 按k的cno正序排序
     */
    final public static void sortKlines(List<KlinesDto> list) {
        Collections.sort(list, new Comparator<KlinesDto>() {
            @Override
            final public int compare(KlinesDto o1, KlinesDto o2) {
                int i = o1.getCno();
                int j = o2.getCno();
                if (i > j)
                    return 1;    //正序 return 1
                else if (i <= j)
                    return -1;    //正序 return -1
                return 0;
            }
        });
    }

    /**
     * d 四舍五入 m
     */
    final public static double getRound(double d, int m) {
        String rs = String.format("%." + m + "f", d);
        return Double.parseDouble(rs);
    }

    public static void main(String[] args) {

        //System.out.println(isAfter("20110101015901", "20110101015900"));
        //System.out.println(calendar2Str(str2Calendar("20110101000000"), "yyyy-MM-dd"));


//		System.out.println(getMinusTimeByHour("20110101015901", 11));
//		getKTimeByPeriod("20110830015901",Mark.Period_H1);
        //System.out.println(difMinutes(20120105080900L, 20120105072500L));

//		System.out.println(isDivisible(Mark.Period_M30, "20110102233000"));
//		OverallPareManager.getSingleInstance().setVersion(Mark.Version_v05);
//		System.out.println(difHour(Mark.Time_1900, Mark.Time_1900) !=0 );

        double d = 3.1415926;
        //String result = String.format("%.3f", d);
        System.out.println(getRound(d, 3));
    }
}
