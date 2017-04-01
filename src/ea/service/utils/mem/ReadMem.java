package ea.service.utils.mem;

import org.xvolks.jnative.JNative;
import org.xvolks.jnative.Type;
import org.xvolks.jnative.exceptions.NativeException;

import ea.service.utils.var.control.UtilVar;



/**
 * 与MT4数据通信的工具类 ：JNativeDll
 * ShareMem1.dll ：MT4读取写入数据，Java读取
 * @author Liang.W.William
 *
 */
public class ReadMem {
	private String path = null;
	private static ReadMem singleInstance = null;	// 唯一实例
	private String dllName = "ShareMem1.dll";
	JNative jn = null;
	
	/**
	 * 返回唯一实例。如果是第一次调用此方法，则创建实例
	 */
	public static ReadMem getSingleInstance() {
		if (singleInstance == null) {
			synchronized (ReadMem.class) {
				if (singleInstance == null) {
					singleInstance = new ReadMem();
				}
			}
		}
		return singleInstance;
	}

	/**
	 * 静态自由块 创建实例 并初始化通信设置
	 */
	static {
		ReadMem jn = ReadMem.getSingleInstance();
		jn.initByFunName("InitializeServer");	//Server 初始化返回值1成功
		jn.initByFunName("OpenMem");			//Server/client open 回值1成功
		jn.initByFunName("InitializeClient");	//Client 初始化返回值1成功
	}
	
	public ReadMem(){
		this.path = UtilVar.getSingleInstance().getStr("shareMem01");
		System.load(this.path);
		try {
			jn = new JNative(this.dllName, "ReadMem");
		} catch (NativeException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 根据方法名调用
	 * @param name
	 */
	public  void initByFunName(String name){
		JNative iniServer = null;
		try{
			System.load(this.path);
			iniServer = new JNative(this.dllName, name);
			iniServer.setRetVal(Type.INT);
			iniServer.invoke();
			if("DestroyMem".equals(name)){
				//System.out.println("销毁共享内存");
			}else{
				//System.out.println((Integer.valueOf(iniServer.getRetVal())==1)?name+" 初始化成功":name+" 初始化失败");
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 写数据到内存
	 * @param val
	 */
	public  void writeMem(String val){
		JNative n = null;
		try{
			System.load(this.path);
			n = new JNative(this.dllName, "WriteMem");
			n.setRetVal(Type.INT);
			n.setParameter(0, val);
			n.setParameter(1, val.length());
			n.invoke();
			//System.out.println((Integer.valueOf(n.getRetVal())==1)?"数据写入成功":" 数据写入失败");
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 从内存读取数据
	 * @param val
	 * @return 
	 */
	public String readMem(){
		String rs = null;
		try{
			jn.setRetVal(Type.STRING);
			jn.invoke();
			rs = jn.getRetVal();
			//System.out.println("内存读取数据--->" + rs);
		}catch(Exception e){
			e.printStackTrace();
		}
		return rs;
	}
	
	public static void main(String[] args) {
		ReadMem jn = ReadMem.getSingleInstance();
		jn.writeMem("qwqwqwqw");
		jn.readMem();
		//jn.initByFunName("DestroyMem");
	}
}
