package test.guava;

import java.math.BigDecimal;
import java.text.NumberFormat;

/**
 * Created by tomjack on 15/10/29.
 */
public class Test1 {

    public static Object norm(Object value) {
        if (value instanceof BigDecimal) {
            BigDecimal bigValue = (BigDecimal) value;
            double f1 = bigValue.setScale(4, BigDecimal.ROUND_HALF_UP).doubleValue();
            return f1;
        } else {
            return value;
        }
    }


    public static String getNumKb(BigDecimal bigDecimal) {
        NumberFormat numberFormat = NumberFormat.getNumberInstance();
        numberFormat.setMaximumFractionDigits(2);
        numberFormat.setGroupingUsed(false);
        return numberFormat.format(bigDecimal);
    }

    public static void main(String[] args){
       // System.out.println(getNumKb(new BigDecimal("88321131311263.21212")));
        //new BigDecimal()
        BigDecimal bigValue = new BigDecimal("0.21212");
        BigDecimal b1 = new BigDecimal(100);
        NumberFormat numberFormat = NumberFormat.getNumberInstance();
        numberFormat.setGroupingUsed(false);
        numberFormat.setMaximumFractionDigits(2);
        String doubleValue = numberFormat.format(bigValue.multiply(b1).doubleValue());
        System.out.println( doubleValue + "%");
    }
}
