package test;

import ea.service.res.data.page.PageManager;
import ea.service.res.dto.CandlesDto;

import java.util.Date;

public class TestData {
	
	public static void test_getCandlesDtoByTime() {
		PageManager pdata = PageManager.getSingleInstance();
		//PageDto dto = pdata.getPageMap(Mark.Period_M1, 1);
		CandlesDto dto = pdata.getCandlesDtoByTime(1, 20120209064100L);
		String bin = dto.getCno()+"", end = dto.getHigh()+"";
		System.out.println(bin + "----" + end );
		dto = dto = pdata.getCandlesDtoByTime(1, 20120229070000L);
		bin = dto.getCno()+""; end = dto.getHigh()+"";
		System.out.println(bin + "----" + end );
		dto = dto = pdata.getCandlesDtoByTime(1, 20120229071100L);
		bin = dto.getCno()+""; end = dto.getHigh()+"";
		System.out.println(bin + "----" + end );
		dto = dto = pdata.getCandlesDtoByTime(1, 20120409074200L);
		bin = dto.getCno()+""; end = dto.getHigh()+"";
		System.out.println(bin + "----" + end );
		dto = dto = pdata.getCandlesDtoByTime(1, 20120409075200L);
		bin = dto.getCno()+""; end = dto.getHigh()+"";
		System.out.println(bin + "----" + end );
		//HashMap<String, CandlesDto> map = dto.getMap();
		//CandlesDto kdto = map.get("20120102070600");
		//System.out.println(bin + "----" + end + " --- " + kdto.getCno() + " : " + map.get("20120102070900").getCno());
	}

	public static void testDate(){
		try {

			Date a = new Date();

			Thread.sleep(4000);

			Date b = new Date();

			long interval = (b.getTime() - a.getTime()) / 1000;

			System.out.println("两个时间相差" + interval + "秒");//会打印出相差3秒

		} catch (InterruptedException e) {

			e.printStackTrace();
		}
	}

	public static void main(String[] args) {

		testDate();

		Long i = 20120409075200L;
		Long a = 20120409075201L;
		/*CandlesDto dto = Data.pageManager.getCandlesDtoByTime(Mark.Period_M10, 20120106221000L);
		System.out.println(dto);*/

		/*long startTime = System.currentTimeMillis();   //获取开始时间
		while (true) {

			//测试的代码段
			long endTime = System.currentTimeMillis(); //获取结束时间
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			System.out.println("程序运行时间： " + (endTime - startTime) + "s");
		}*/


	}
}
