package test.utils;

/**
 * Created by liang.wang.sh on 2017/1/24.
 */
public class MathUtil {

    public static void main(String[] args) {
        String str = "-9.99%";
        int i = getIntValue(str);
        System.out.println(str + "->" + i);

        String str2 = "-9.99%";
        double d = getDoubleValue(str2);
        System.out.println(str2 + "->" + d);
    }

    /**
     * 解析str，获得其中的整数
     *
     * @param str
     * @return
     */
    public static int getIntValue(String str) {
        int r = 0;
        if (str != null && str.length() != 0) {
            StringBuffer bf = new StringBuffer();

            char[] chars = str.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char c = chars[i];
                if (c >= '0' && c <= '9') {
                    bf.append(c);
                } else if (c == ',') {
                    continue;
                } else {
                    if (bf.length() != 0) {
                        break;
                    }
                }
            }
            try {
                r = Integer.parseInt(bf.toString());
                if (str.contains("-")) {
                    r = 0 - r;
                }
            } catch (Exception e) {
            }
        }
        return r;
    }

    /**
     * 解析字符串获得双精度型数值，
     *
     * @param str
     * @return
     */
    public static double getDoubleValue(String str) {
        double d = 0;

        if (str != null && str.length() != 0) {
            StringBuffer bf = new StringBuffer();

            char[] chars = str.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char c = chars[i];
                if (c >= '0' && c <= '9') {
                    bf.append(c);
                } else if (c == '.') {
                    if (bf.length() == 0) {
                        continue;
                    } else if (bf.indexOf(".") != -1) {
                        break;
                    } else {
                        bf.append(c);
                    }
                } else {
                    if (bf.length() != 0) {
                        break;
                    }
                }
            }
            try {
                d = Double.parseDouble(bf.toString());
                if (str.contains("-")) {
                    d = 0 - d;
                }
            } catch (Exception e) {
            }
        }



        return d;
    }

    public static double getDoubleCurrency(String str){
        if(str.contains("亿")){
            return getDoubleValue(str);
        }
        if(str.contains("万")){
            double currency = getDoubleValue(str) / 10000;
            return currency;
        }
        return 0;
    }
}
