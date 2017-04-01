package ea.service.utils.mem;

import org.xvolks.jnative.JNative;
import org.xvolks.jnative.Type;
import org.xvolks.jnative.exceptions.NativeException;

import ea.service.utils.comm.Util;
import ea.service.utils.var.control.UtilVar;

/**
 * 与MT4数据通信的工具类 ：JNativeDll
 * ShareMem2.dll ：Java写入数据，MT4读取
 * @author Liang.W.William
 *
 */
public class WriteMem {
	private String path = null;
	private static WriteMem singleInstance = null;	// 唯一实例
	private String dllName = "ShareMem2.dll";
	JNative jn = null;
	
	/**
	 * 返回唯一实例。如果是第一次调用此方法，则创建实例
	 */
	public static WriteMem getSingleInstance() {
		if (singleInstance == null) {
			synchronized (WriteMem.class) {
				if (singleInstance == null) {
					singleInstance = new WriteMem();
				}
			}
		}
		return singleInstance;
	}

	/**
	 * 静态自由块 创建实例 并初始化通信设置
	 */
	static {
		WriteMem jn = WriteMem.getSingleInstance();
		jn.initByFunName("InitializeServer2");	//Server 初始化返回值1成功
		jn.initByFunName("OpenMem2");			//Server/client open 回值1成功
		jn.initByFunName("InitializeClient2");	//Client 初始化返回值1成功
	}
	
	public WriteMem(){
		this.path = UtilVar.getSingleInstance().getStr("shareMem02");
		System.load(this.path);
		try {
			jn = new JNative(this.dllName, "WriteMem2");
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
		String info = Util.getCurrTime() + " 数据写入成功:" + val;
		try{
			jn.setRetVal(Type.INT);
			jn.setParameter(0, val);
			jn.setParameter(1, val.length());
			jn.invoke();
			System.out.println((Integer.valueOf(jn.getRetVal())==1)?info:" 数据写入失败");
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 从内存读取数据
	 * @param val
	 */
	public  void readMem(){
		JNative n = null;
		try{
			System.load(this.path);
			n = new JNative(this.dllName, "ReadMem2");
			n.setRetVal(Type.STRING);
			n.invoke();
			System.out.println("内存读取数据--->" + n.getRetVal());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		WriteMem jn = WriteMem.getSingleInstance();
		jn.writeMem("qwqwqwqw");
		jn.readMem();
		//jn.initByFunName("DestroyMem");
	}
}
