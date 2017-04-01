package ea.server;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import ea.service.res.db.control.DBHandler;
import ea.service.res.dto.BaseDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;


public class CheckCandles {

    private int YEAR = 2011;
    private String Month_Day = "0101000100";
    private boolean IS_OUT = false;    //是否输出到文件
    private final String TABLE = "t_candle";
    private final String URL = "D:/Data/DataCheck/" + this.YEAR + "_M1.txt";
    private final String Stop_URL = "D:/Data/DataCheck/" + this.YEAR + "全年停盘时间.txt";
    private final int Margin = 1;    //每次增加的分钟数
    private final int DifMinutes = 1440; //一天的分钟数,筛选出大于等译一天的数据
    private final int Period = Mark.Period_M01;

    /**
     * Step001:得到全年停盘时间list，筛选出大于等于一天的数据存入库
     */
    private ArrayList<long[]> getStopTime() {
        String sql = "select time from " + this.TABLE + " ORDER BY time asc";
        List<BaseDto> rs = Data.getDataControl.exeSqlToDto(sql);
        Iterator<BaseDto> it = rs.iterator();
        ArrayList<long[]> list = new ArrayList<long[]>();

        long temp = 0;
        int flag = 1, difMinutes = 0;

        while (it.hasNext()) {
            long time = it.next().getTime();
            difMinutes = Util.difMinutes(temp, time);
            if (temp != 0 && difMinutes > 1) {
                if (difMinutes >= this.DifMinutes) {
                    long[] arr = {temp, time};
                    list.add(arr);
                    String str = flag + ": " + Util.formatLng(temp) + " <----> " + Util.formatLng(time) + " : " + difMinutes + "分钟";
                    System.out.println(str);
                    Data.exeDataControl.exeSql("insert into t_stoptime(year,b_time,e_time,total) VALUES(" + this.YEAR + "," + temp + "," + time + "," + difMinutes + ");");
                    if (this.IS_OUT) Util.writer(this.Stop_URL, str);
                    flag++;
                }
            }
            temp = time;
        }
        return list;
    }

    /**
     * 检验是否在停盘范围内:如果在停盘内返回true
     */
    private boolean isConTime(long time, ArrayList<long[]> list) {
        Iterator<long[]> it = list.iterator();
        while (it.hasNext()) {
            long[] arr = it.next();
            long t1 = arr[0], t2 = arr[1];
            if (time >= t1 && time <= t2) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检验是否在停盘 或 数据库中有无数据:不存在返回true
     */
    private boolean checkTimeNull(long time, ArrayList<long[]> list) {
        if (this.isConTime(time, list)) {
            return false;
        }
        return !Data.pageManager.isInDBExist(this.Period, time);
    }

    public void checkDealTimes(int year) {
        this.YEAR = year;
        ArrayList<long[]> list = this.getStopTime();
        Calendar a = Util.str2Calendar(this.YEAR + this.Month_Day);
        a.add(Calendar.YEAR, 1);
        Calendar end = a;
        a = Util.str2Calendar(DBHandler.getTimeByCno(1, this.TABLE));
        a.add(Calendar.MINUTE, this.Margin);
        while (a.before(end)) {
            long time = Util.calendar2Lng(a);
            //System.out.println(time);
            if (this.checkTimeNull(time, list)) {
                String print = Util.formatLng(time);
                System.out.println("==========> " + print);
                Data.exeDataControl.exeSql("insert into t_misData(period,time) VALUES(" + this.Period + "," + time + ");");
                if (this.IS_OUT) Util.writer(this.URL, print + " : " + time);
            }
            a.add(Calendar.MINUTE, this.Margin);
        }
    }

    public static void main(String[] args) {
        CheckCandles c = new CheckCandles();
        c.checkDealTimes(2010);

		/*boolean b = Data.pageManager.isInDBExist(1, 20120106220100L);
        System.out.println(b);
		Calendar a = Util.str2Calendar(2012 + "0101000100");
		a.add(Calendar.YEAR, 1);
		System.out.println( Util.calendar2Str(a, Util.Calendar2Str));*/
    }
}
