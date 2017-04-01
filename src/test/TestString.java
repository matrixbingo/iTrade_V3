package test;

import ea.service.utils.comm.Maths;

import java.text.DecimalFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TestString {
	private StringBuffer sb = null; 
	private static TestString singleInstance = null; //唯一实例



	public static TestString getSingleInstance(){
		if (singleInstance == null) {
			synchronized (TestString.class) {
				if (singleInstance == null) {
					singleInstance = new TestString();
				}
			}
		}
		return singleInstance;
	}
	
	private TestString(){
		this.sb = new StringBuffer();
	}
	
	public void test(int i){ 
		this.sb.setLength(0);
		String key = this.sb.append("------>").append(i).toString();
		System.out.println(key);
	}

	public static String getSql(int period, int start, int end, boolean useMacd) {
		if(useMacd){
			return new StringBuffer("select t1.time, t1.cno, t1.open, t1.close, t1.high, t1.low, t2.bar from ")
					.append(ea.service.utils.comm.Util.getTabNameByPeriod(period)).append(" t1 ")
					.append("left join t_macd t2 on t2.period=")
					.append(period).append(" and t1.cno = t2.cno ")
					.append("where t1.cno > ")
					.append(start - 200)
					.append(" and t1.cno <= ")
					.append(end)
					.append(" order by t1.cno asc;")
					.toString();
		}else{
			return new StringBuilder("select t1.time, t1.cno, t1.open, t1.close, t1.high, t1.low, 0 as bar from ")
					.append(ea.service.utils.comm.Util.getTabNameByPeriod(period)).append(" t1 ")
					.append("where t1.cno > ")
					.append(start - 200)
					.append(" and t1.cno <= ")
					.append(end)
					.append(" order by t1.cno asc;")
					.toString();
		}

		//sql.append()


		//return sql.toString();
	}
	
	public static void main(String[] args) {
/*		for(int i = 0; i<100 ;i++){
			TestString.getSingleInstance().test(i);
		}*/
		double a = Maths.alsSubPrice(1.2920, 1.2934);
		double b = Math.abs(174-198);
		int c = Maths.priceToIntFour(0.58368);
		DecimalFormat df  = new DecimalFormat("###0.0000");//这样为保持3位
		float num= (float)10/43;  
		int a1 = 10;
		int b1 = 43;
		String s = df.format((float)10/43);

		System.out.println(a + " / " + b + " = " + c);
		
		System.out.println(Maths.priceToIntFour(0.111));
		
		String str = "2013-12-26 08:53:46";
		
		System.out.println(getSql(1, 0, 20000, false));



		String cccc = "wqwqwqw";


		TestString TestString =  new TestString();
		TestString.init();

		String ab = "love23.21asasas";
		String regEx = "[^0-9]";
		Pattern p = Pattern.compile(regEx);
		Matcher m = p.matcher(ab);
		System.out.println(m.replaceAll("").trim());
	}

	public void init(){
		System.out.println(bbb);
	}

	public  String bbb = "wqwqwqw";

	public static String aaaa = "asasas";
}
