package ea.server;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Shutdown {
	/**
	 * 立刻关机
	 */
	public void shutdown(){
		Calendar rightNow = Calendar.getInstance();
		rightNow.add(Calendar.MINUTE, 1);
		SimpleDateFormat fmt1 = new SimpleDateFormat("HH:mm");
        String time = fmt1.format(rightNow.getTime());
        System.out.println("关机时间：" + time);
		String cmd = "schtasks /create /tn ShutdownWin /st " + time + " /sc daily /tr \"shutdown /s /t 0 /f\"";
		try {
			Runtime.getRuntime().exec(cmd);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		new Shutdown().shutdown();
	}

}
