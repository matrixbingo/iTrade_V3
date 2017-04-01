package ea.module.fx.param;

import ea.server.Controller;

public class ParamFx {
	private int fx_step01 = 2;
	private int fx_step02 = 1;
	private int fx_step03 = Controller.fx_step03;
	private int fx_step04 = Controller.fx_step04;
	private int fx_step05 = 3;
	private int fx_step06 = 3;
	
	private static ParamFx singleInstance = null; //唯一实例 
	
	public static ParamFx getSingleInstance(){
		if (singleInstance == null) {
			synchronized (ParamFx.class) {
				if (singleInstance == null) {
					singleInstance = new ParamFx();
				}
			}
		}
		return singleInstance;
	}
	public int getFx_step01() {
		return fx_step01;
	}

	public void setFx_step01(int fx_step01) {
		this.fx_step01 = fx_step01;
	}

	public int getFx_step02() {
		return fx_step02;
	}

	public void setFx_step02(int fx_step02) {
		this.fx_step02 = fx_step02;
	}

	public int getFx_step03() {
		return fx_step03;
	}
	public void setFx_step03(int fx_step03) {
		this.fx_step03 = fx_step03;
	}
	public int getFx_step04() {
		return fx_step04;
	}
	public void setFx_step04(int fx_step04) {
		this.fx_step04 = fx_step04;
	}
	
	public int getFx_step05() {
		return fx_step05;
	}

	public void setFx_step05(int fx_step05) {
		this.fx_step05 = fx_step05;
	}

	public int getFx_step06() {
		return fx_step06;
	}

	public void setFx_step06(int fx_step06) {
		this.fx_step06 = fx_step06;
	}

	public String toString(){
		return "fx_step01 : " + this.fx_step01 
				+ " fx_step02 : " + this.fx_step02 
				+ " fx_step03 : " + this.fx_step03 
				+ " fx_step04 : " + this.fx_step04
				+ " fx_step05 : " + this.fx_step05
				+ " fx_step06 : " + this.fx_step06;
	}
}
