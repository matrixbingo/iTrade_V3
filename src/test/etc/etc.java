package test.etc;
/*
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import css.common.files;
import css.common.img;
import css.common.mq;
import css.common.numbers;
import css.common.regx;
import css.common.security;
import css.common.strings;
import css.common.sys;
import css.common.times;
import css.common.ican.scan;*/

public class etc {
/*
	// 处理时间相关的类
	public static times TIMES = new times();
	
	// 处理数字与数学的相关类
	public static numbers NUMBERS = new numbers();
	
	// 字符串处理的相关类
	public static strings STRINGS = new strings();

	// 文件处理的相关类
	public static files FILES = new files();

	// 文件处理的相关类
	public static ArrayList<String> FILES_CACHE = new ArrayList<String>();

	// 目录存储
	public static ArrayList<String> DIRS_CACHE = new ArrayList<String>();

	// 正则表达式相关类
	public static regx REGX = new regx();

	// 处理系统相关内容
	public static sys SYS = new sys();

	// 处理图片相关
	public static img IMG = new img();

	// 处理网络相关
	public static web WEB = new web();

	// 处理系统mq
	public static mq MQ = new mq();

	// 安全相关处理
	public static security SECURITY = new security();

	// 数据库相关
	public static db DB = new db();

	public static int WARN_CNT = 0;

	public static int ERROR_CNT = 0;

	// 成功的内容
	public static int SUCCESS_CNT = 0;

	// 列表相关
	public static array ARRAY = new array();

	// css.scan系统的所有处理
	public static scan SCAN = new scan();

	// 共用值
	public static constx CONSTS = new constx();

	// 线程相关
	public static thread THREAD = new thread();

	// 反射相关的类
	public static reflect REFLECT = new reflect();
	
	// MySQL相关的类
	public static mysql MYSQL = new mysql();
	
	// SQLLITE相关的类
	public static sqllite SQLLITE = new sqllite();

	// JSON相关的类
	public static json JSON = new json();

	// 中文文本处理
	public static chinese CHI = new chinese();

	// redis处理
	public static redis REDIS = new redis();

	/////////////////////////////////////////////
	//
	// 功能: 用于进行各种测试
	// java -cp css_etc.jar css.common.etc regx "<abc" "^<" 
    //
	/////////////////////////////////////////////

	public static void main(String [] args){

    	try {

    		if ("guid".equals(args[0])){

    			String v = SECURITY.getGUID();
    			System.out.println(v);
    			System.exit(1);
    			return;

    		}

    		if ("regx".equals(args[0])){

    			String v = REGX.findFirstData(args[1], args[2]);
    			System.out.println(v);
    			return;

    		}

    		// 对url进行编码,如其中包含中文时的处理
    		if ("url_encode".equals(args[0])){

    			String v = WEB.url_encode(args[1]);
    			//String v = WEB.url_encode("中国");
    			System.out.println(v);
    			return;

    		}
    		
		} catch (Exception e) {
			etc.error(etc.getExceptionStackTrace(e));
		}

		etc.info("finish");
		etc.sumarry();

    }


	public static String getAppPath(){
		return getAppPath(etc.class);
	}

	public static String getAppPath(Object obj){
		return getAppPath(obj.getClass());
	}

	public static String getAppPath(Class<?> cls){		
		
	    //检查用户传入的参数是否为空  
	    if(cls == null) {   
	    	throw new IllegalArgumentException("参数不能为空！");
	    }

	    ClassLoader loader = cls.getClassLoader();  
	    //获得类的全名，包括包名  
	    String clsName = cls.getName() + ".class";  
	    //获得传入参数所在的包  
	    Package pack = cls.getPackage();  
	    String path = "";

	    //如果不是匿名包，将包名转化为路径  
	    if(pack != null){

			String packName = pack.getName();

			//此处简单判定是否是Java基础类库，防止用户传入JDK内置的类库  
			if(packName.startsWith("java.") || packName.startsWith("javax."))   
				throw new IllegalArgumentException("不要传送系统类！");

			//在类的名称中，去掉包名的部分，获得类的文件名  
			clsName = clsName.substring(packName.length()+1);  
			//判定包名是否是简单包名，如果是，则直接将包名转换为路径，  
			if(packName.indexOf(".")<0) path = packName + "/";  
			else{//否则按照包名的组成部分，将包名转换为路径  
				int start = 0,end = 0;  
				end = packName.indexOf(".");  
				while(end != -1){  
					path = path + packName.substring(start,end) + "/";  
					start = end + 1;
					end = packName.indexOf(".",start);  
				}  
				path = path + packName.substring(start) + "/";
			}
	    }

	    //调用ClassLoader的getResource方法，传入包含路径信息的类文件名  
	    java.net.URL url =loader.getResource(path + clsName);
	    //从URL对象中获取路径信息  
	    String realPath = url.getPath();  
	    //去掉路径信息中的协议名"file:"  
	    int pos = realPath.indexOf("file:");  
	    if(pos>-1) realPath = realPath.substring(pos + 5);  
	    //去掉路径信息最后包含类文件信息的部分，得到类所在的路径  
	    pos = realPath.indexOf(path + clsName);
	    realPath = realPath.substring(0,pos-1);  
	    //如果类文件被打包到JAR等文件中时，去掉对应的JAR等打包文件名  
	    if(realPath.endsWith("!"))
	        realPath = realPath.substring(0,realPath.lastIndexOf("/"));

	  *//*------------------------------------------------------------
	   ClassLoader的getResource方法使用了utf-8对路径信息进行了编码，当路径 
	    中存在中文和空格时，他会对这些字符进行转换，这样，得到的往往不是我们想要 
	    的真实路径，在此，调用了URLDecoder的decode方法进行解码，以便得到原始的 
	    中文及空格路径 
	  -------------------------------------------------------------*//*
	  try{

		  realPath=java.net.URLDecoder.decode(realPath,"utf-8");  

	  }catch(Exception e){throw new RuntimeException(e);}  
	   return realPath;

	}//getAppPath定义结束
	
//	public static boolean isUTF8_char(String str){
//
//		Pattern pattern = Pattern.compile("[0-9]*");
//		Matcher isNum = pattern.matcher(str);
//		if( !isNum.matches()){
//			return false;
//		}
//		return true;
//
//	}

	*//*
	 * "{\"cmd\":\"insert\",\"target\":\"t_custom\",\"paras\":{\"v_cid\":\"A12345698\",\"i_coins\":100,\"v_uname\":\"TOM\",\"i_phonenum\":102,\"i_lotteries\":101},\"tag\":\"null\"}";
	 * *//*
	public static String json2InsertSQL(SQLMAP ent){

		String sql = "";
		
		HashMap<String,String> back = new HashMap<String,String>();

		try{
			String tabnm = ent.TARGET;
			JSONObject valsJson = JSONObject.fromObject(ent.PARAS);
			
			JSONObject sendsJson;
			if (ent.PARAS2 == null || ent.PARAS2 == "" || 
					ent.PARAS2 == "null" || ent.PARAS2.length()==0){
				sendsJson = JSONObject.fromObject("{}");
			}else{
				sendsJson = JSONObject.fromObject(ent.PARAS2);				
			}

			String title = "INSERT INTO " + tabnm;
			String keys = "";
			String vals = "";

			Iterator<?> iter = valsJson.keys();

			while (iter.hasNext()) {

			    String k = (String)iter.next();
			    String v = "";

			    if (v.equals("NEWGUID")){
			    	v = etc.SECURITY.getGUID();
			    }

			    if (v.equals("DATETIME")){
			    	v = TIMES.getDateTimeStamp();
			    }

			    if (v.equals("TIMESTAMP")){
			    	v = TIMES.getTimeStamp();
			    }
			    
			    if(sendsJson.containsKey(k)){
			    	if ("TRUE".equals(sendsJson.get(k))){
			    		back.put(k, v);
			    		//System.out.println("sql.key ===>" + k);
			    	}
			    }

			    keys = keys + k + ",";
			    vals = vals + formatSQLVal4Mysql(k, v) + ",";

			}

			sql = title + " (" + etc.STRINGS.trimTail(keys) + ") "
			            + " VALUES("
			            + etc.STRINGS.trimTail(vals) 
			            + ")";
			
		}catch(Exception e){
			System.out.println("ERROR.getInsertSQL ===>" + e.toString());
		}
		return sql;

	}

	//对数据库入库数据进行转译
//	public static String mysqltrans(String argVal){
//
//		String rtn = "";
//		rtn = argVal.replaceAll("'", "\'");
//		return rtn;
//
//	}

	*//**
	 * 
	 * 功能字符串为null或长度为0时候返回true
	 * 
	 * *//*
	public static boolean isEmpty(String str){
		
		boolean rtn = false;
		if(str == null){
			return true;	
		}

		if(str.length() == 0){
			return true;	
		}
		return rtn;

	}

	public static boolean isNull(Object obj){

		boolean rtn = false;
		if(obj == null){
			rtn = true;
		}
		return rtn;

	}
	
	*//**
	 * 功能 : 读取命令行的输入,不做任何处理。
	 * 用途: 程序运行时暂停,确认输出值.
	 *   
	 * *//*

	public static void readCslLine(){

		byte[] b = new byte[1024];

		try {

			System.in.read(b);

		} catch (Exception e) {
			error(e.toString());
		}
		return;

	}

	*//**
	 * 
	 * 功能: 获得Exception的StackTrace信息
	 * @param argExp 异常
	 * 
	 * *//*
	public static String getExceptionStackTrace(Exception e) {  
        
		try {

            StringWriter sw = new StringWriter();  
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);

            return "\r\n" + sw.toString() + "\r\n";

		} catch (Exception ex) {  
            return "error Exception @ getExceptionStackTrace";
        }

    }
	
//	//将包含Stack内容的错误信息,追加输出到文件
//	public static void outputErrorWithAppend(Exception argEx,String argPath){
//		
//		try {
//
//			PrintWriter p = new PrintWriter(new FileOutputStream(argPath), true);
//			argEx.printStackTrace(p);
//			p.flush();
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//	}

//	public static List<Element> getElementsByAccurateCSS(Document doc, String tag, String css){
//
//		List<Element> rtn = new ArrayList<Element>();
//		Elements es = doc.getElementsByTag(tag);
//		for(Element e : es){
//			if (css.equals(e.attr("class"))){
//				Elements items = e.getAllElements();
//				for(Element item : items){
//					rtn.add(item);
//				}
//			}
//		}
//		return rtn;
//
//	}

//	public static List<Element> getElementsBySelect(Document doc, String select){
//
//		List<Element> rtn = new ArrayList<Element>();
//		Elements es = doc.select(select);
//		for(Element e : es){
//			rtn.add(e);			
//		}
//		return rtn;
//
//	}
	
	public static void isInstance(Object obj){

		if(obj == null){
			etc.error(" Object is null!");
		}
		return;

	}

	public static void debug(String val){

		System.out.println("[DEBUG::] " + val);

	}

	public static void info(String val){

		try{

			System.out.println("[INFO::] " + val);

		}catch(Exception e){
			
		}
		
	}

	public static void warn(String val){

		WARN_CNT++;
		System.out.println("[WARN::] " + val);

	}
	
	public static void success(String val){

		SUCCESS_CNT++;
		System.out.println("[SUCCESS::] " + val);

	}

//	public static void debugGreen(String val){
//
//		System.out.println(ansi().eraseScreen().fg(RED).a ("Hello").fg (GREEN).a(" World").reset() );
//		
//	}
	
	public static void error(String val){

		ERROR_CNT++;
		System.out.println("[ERROR::] " + val);

	}

	public static void sumarry(){

		System.out.println("-----------------------------------------------------------------------");
		System.out.println("success :: " + SUCCESS_CNT + "   error :: " + ERROR_CNT + "      warn:: " + WARN_CNT);
		System.out.println("");
		System.out.println("");
		System.out.println("");

	}

	private static String formatSQLVal4Mysql(String fld, String val){

		String rtn = val;

		if(val.contains("\\")){
			val = val.replace("\\", "\\\\");	
		}

		if(val.contains("'")){
			val = val.replace("'", "\\'");	
		}

		if (fld.startsWith("v") || fld.startsWith("t") ){
			rtn = "'" + val + "'";
		}

		if (fld.startsWith("V") || fld.startsWith("T") ){
			rtn = "'" + val + "'";
		}
		return rtn;

	}


	*//********************************************************************
	 *
	 * {"cmd":"insert","target":"t_custom","paras":{"col1":"a","col3":"c","col2":"b"},"paras2":"","tag":""}
	 *
	 *********************************************************************//*
	public static class SQLMAP {

		public String CMD = "";
		public String TARGET = "";
		public String PARAS = "";
		public String PARAS2 = "";
		public String TAG = "";
		public String RESULTS = "";

		public SQLMAP(String val) {

			JSONObject json = (JSONObject)JSONSerializer.toJSON(val);
			CMD = (String)json.get("cmd");
			TARGET = (String)json.get("target");
			PARAS = (String)json.get("paras").toString();

			if (json.get("paras2") == null || json.get("paras2") == "null"){
				PARAS2 = null;
			}else{
				PARAS2 = (String)json.get("paras2").toString();	
			}

			if (json.get("tag") == null){
				TAG = null;
			}else{
				TAG = (String)json.get("tag").toString();	
			}
		}
		
		public List<String> getKeys() {
			ArrayList<String> rtn = new ArrayList<String>();
			
			JSONObject jsonObj = JSONObject.fromObject(PARAS);
			for (Iterator<?> i = jsonObj.keys(); i.hasNext();){
		    	String k = (String)i.next();
		    	rtn.add(k);
			}
			return rtn;
		}
		
	}*/
}
