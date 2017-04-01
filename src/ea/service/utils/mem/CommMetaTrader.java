package ea.service.utils.mem;


/**
 * 与MT4通信
 * @author Liang.W.William
 *
 */
public class CommMetaTrader {

	private static CommMetaTrader singleInstance = null;	// 唯一实例
	
	public static CommMetaTrader getSingleInstance() {
		if (singleInstance == null) {
			synchronized (CommMetaTrader.class) {
				if (singleInstance == null) {
					singleInstance = new CommMetaTrader();
				}
			}
		}
		return singleInstance;
	}
	
	/**
	 * 写数据命令到内存
	 * @param info
	 */
	public void writeMemory(String info){
		WriteMem.getSingleInstance().writeMem(info);
	}
	/**
	 * 写数据命令到内存
	 * @param info
	 */
	public String readMemory(){
		return ReadMem.getSingleInstance().readMem();
	}
	
	
	public static void main(String[] args) {
		//CommMt4.getSingleInstance().writeMemory("123467");
		//ReadMem jn = ReadMem.getSingleInstance();
		//jn.writeMem("qwqwqwqw");
		String rs = CommMetaTrader.getSingleInstance().readMemory();
		System.out.println("内存读取数据--->" + rs);
		//发送指令
		CommMetaTrader.getSingleInstance().writeMemory("ask");
	}
}
