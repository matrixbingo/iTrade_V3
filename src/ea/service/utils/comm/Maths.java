package ea.service.utils.comm;

import java.math.BigDecimal;
import java.text.DecimalFormat;

public class Maths {
	private static BigDecimal a = null, b = null;
	private static DecimalFormat df  = new DecimalFormat("###0.0000");//这样为保持4位
	/**
	 *	p1加p2:转成
	 */
	final public static double add(double p1, double p2){
		a = new BigDecimal(String.valueOf(p1));
		b = new BigDecimal(String.valueOf(p2));
		return a.add(b).doubleValue();
	}
	
	/**
	 *	d2减d1:转成整数
	 */
	final public static int subtract(double p1, double p2){
		return Maths.priceToIntFive(p2)-Maths.priceToIntFive(p1);
	}
	/**
	 * d2减d1:转成整数取绝对值,转5位
	 */
	final public static int alsSub(double p1, double p2){
		return Math.abs(Maths.priceToIntFive(p2)-Maths.priceToIntFive(p1));
	}
	/**
	 * d2减d1:转成整数取绝对值,转4位
	 */
	final public static int alsSubPrice(double p1, double p2){
		return Math.abs(Maths.priceToIntFour(p2)-Maths.priceToIntFour(p1));
	}
	/**
	 *	乘
	 */
	final public static double multiply(){
		
		return 0;
	}
	
	/**
	 *	除
	 */
	final public static double divide(double p1, double p2){
		a = new BigDecimal(String.valueOf(p1));
		b = new BigDecimal(String.valueOf(p2));
		return a.divide(b).doubleValue();
	}
	
   	final public static double divide(int p1, int p2){
   		return Double.valueOf(df.format((float)p1/p2));
   	}
	/**
	 * privce to int 转5位
	 */
	final public static int priceToIntFive(double price){
		return new BigDecimal(String.valueOf(price)).movePointRight(5).intValue();
	}
	/**
	 * privce to int 转4位
	 */
	final public static int priceToIntFour(double price){
		return new BigDecimal(String.valueOf(price)).movePointRight(4).intValue();
	}
	/**
	 * int to privce
	 */
	final public static double intToPrice(int price){
		a = new BigDecimal(price);
		return a.movePointLeft(4).doubleValue();
	}
	/**
	 * 十字坐标计算角度
	 */
	final public static int getAngle(int time, int price){
		int x1 = 0,  x2 = time;		//点1坐标;
	    int y1 = price, y2 = 0;		//点2坐标
	    int x = Math.abs(x1 - x2);
	    int y = Math.abs(y1 - y2);
	    double z = Math.sqrt(x*x + y*y);
	    int jiaodu = Math.round((float)(Math.asin(y/z)/Math.PI*180));	//最终角度
		return jiaodu;
	}
	
	/**
	 * 十字坐标计算角度
	 */
	final public static int getAngle(int c1, double p1, int c2, double p2){
		int c = Math.abs(c1 - c2);
		int pr1 = Maths.priceToIntFive(p1);
		int pr2 =  Maths.priceToIntFive(p2);
		int price = Math.abs(pr1 - pr2);
		return Maths.getAngle(c, price);
	}
	
	/**
	 * (p2-p1)*10000 是否大于sub
	 */
	final public static boolean isMaxParice(double p2, double p1, int sub){
		if(sub == 0){
			return p2 > p1;
		}else if(sub > 0 && Maths.subtract(p1, p2) > sub){
			return true;
		}
		return false;
	}
	
	/**
	 * 
	 
	final public static boolean isMaxAngle(long t1, double p1, long t2, double p2, int angle){
		int ang = Maths.getAngle(t1, p1, t2, p2);
		if(ang >= angle){
			return true;
		}
		return false;
	}
	*/
	public static void main(String[] args) {
		/*String t1 = "20111221113000", t2 = "20111221163000";
		double p1 = 1.3194, p2 = 1.3056;
		int time = Util.difMinutes(t2, t1);
		int pr1 = Maths.privceToInt(p1);
		int pr2 =  Maths.privceToInt(p2);
		int price = Math.abs(pr1 - pr2);
		
		//System.out.println(Maths.isMaxParice(p2, p1, 137));
		//System.out.println(Maths.divide(Maths.add(1.2123, 1.5798), 2));
		//System.out.println(isMaxParice(1.2347,1.2345,3));
		;
		//long a = 20111221163000L;
		System.out.println(alsSub(0.00981,0.001));
		System.out.println(intToPrice(13043));
		System.out.println(priceToInt(1.3043));
		*/
		System.out.println(getAngle(174*5,1.2920,198*5,1.2934));
		System.out.println(getAngle(205*5, 1.293, 209*5, 1.2937));
		System.out.println(getAngle(343*5, 1.3015, 355*5, 1.3057));
		System.out.println(getAngle(621*5, 1.305, 649*5, 1.2967));
		
		/*double a = 355*5 - 343*5;
		double b = 43;*/
		
		System.out.println((double)7/20);
	}
}
