package ea.service.utils.comm;

import org.apache.commons.lang.StringUtils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by liang.wang.sh on 2017/1/25.
 */
public class SimpleDateUtil {

    public static String DATE_FORMAT_INT = "yyyyMMdd";

    // 短日期格式
    public static String DATE_FORMAT = "yyyy-MM-dd";

    // 长日期格式
    public static String TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    final public static int str2Int(String fromat, String time) throws Exception {
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat df = new SimpleDateFormat(fromat);//yyyy-MM-dd HH:mm:ss
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_INT);
        Date date = null;
        if (null != time && time.length() > 5) {
            date = df.parse(time);
            cal.setTime(date);
        }
        return Integer.valueOf(sdf.format(cal.getTime()));
    }

    /**
     * 将日期格式的字符串转换为长整型
     *
     * @param date
     * @param format
     * @return
     */
    public static long convert2long(String date, String format) {
        try {
            if (StringUtils.isNotBlank(date)) {
                if (StringUtils.isBlank(format))
                    format = SimpleDateUtil.TIME_FORMAT;
                SimpleDateFormat sf = new SimpleDateFormat(format);
                return sf.parse(date).getTime();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0l;
    }

    /**
     * 将长整型数字转换为日期格式的字符串
     *
     * @param time
     * @param format
     * @return
     */
    public static String convert2String(long time, String format) {
        if (time > 0l) {
            if (StringUtils.isBlank(format))
                format = SimpleDateUtil.TIME_FORMAT;
            SimpleDateFormat sf = new SimpleDateFormat(format);
            Date date = new Date(time);
            return sf.format(date);
        }
        return "";
    }

    /**
     * 获取当前系统的日期
     *
     * @return
     */
    public static long curTimeMillis() {
        return System.currentTimeMillis();
    }

    /**
     * 示例函数
     *
     * @param args
     */
    public static void main(String[] args) throws Exception{
        /*System.out.println(SimpleDateUtil.convert2long("2000-01-01 01:01:01", SimpleDateUtil.DATE_FORMAT));
        System.out.println(SimpleDateUtil.convert2String(SimpleDateUtil.curTimeMillis(), SimpleDateUtil.TIME_FORMAT));*/
        System.out.println(str2Int("yyyy-MM-dd", "2017-1-24"));
    }
}