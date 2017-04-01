package test;

import com.sid.scandata.sidOriginData;

public class TestSidorigindata {

	
	public static void main(String[] args) {
		com.sid.scandata.sidOriginData sod = new sidOriginData();
   	 	String rtn = sod.get("http://www.ind3xing.com/SID/web/data/getsiddata.php", "201406051516");
   	 	System.out.println(rtn);
	}

}
