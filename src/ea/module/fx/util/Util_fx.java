package ea.module.fx.util;

import java.util.ArrayList;
import java.util.Iterator;

import ea.module.fx.param.ParamFx;
import ea.server.Data;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FxDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Maths;

@SuppressWarnings("unused")
public class Util_fx {
	private boolean flag = false;
	private FxMacdDto dto_fx = new FxMacdDto();
	private CandlesDto dto_k = null, dto_k1 = null, dto_k2 = null, dto_k3 = null, dto_k4 = null, dto_k5 = null;
	private String key = null;
	private ArrayList<String> keys_10 = new ArrayList<String>();
	private ArrayList<CandlesDto> list = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> rs = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> list_updn = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> list_dn = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> list_up = new ArrayList<CandlesDto>();
	private Iterator<CandlesDto> it_k = null;
	private ArrayList<FxDto> list_fx = new ArrayList<FxDto>();
	private int cno, period, dir, bin_cno, end_cno, size, last;

	/**
	 * STEP03 : 去除中间高于两边底的底 或 低于 两边顶的顶，取极值，每次取5点，删除2点
	 */
	final public ArrayList<CandlesDto> removeGapOne(ArrayList<CandlesDto> list, int num){
		if(list.size() > ParamFx.getSingleInstance().getFx_step03()){
			this.flag = true;
			this.cno = num;
			return this.removeGapOneRec(list);
		}else{
			return list;
		}
	}
	/**
	 * STEP03 : 递归
	 */
	final private ArrayList<CandlesDto> removeGapOneRec(ArrayList<CandlesDto> list){
		if(this.flag){
			this.list_updn.clear();
			this.it_k = list.iterator();
			ArrayList<CandlesDto> rs = new ArrayList<CandlesDto>();
			rs.addAll(list);
			this.cno--;
			while(this.it_k.hasNext()){
				this.initListGapOne(this.list_updn, rs, this.it_k.next());	//填充this.rs
			}
			if(this.cno == 0){
				this.flag = false;
			}
			return this.removeGapOneRec(rs);
		}else{
			return list;
		}
	}
	/**
	 * STEP03 : 每次取5条数据 removeGapOneRec
	 */
	final private void initListGapOne(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list, CandlesDto dto){
		if(list_updn.size() == 5){
			list_updn.set(0, (list_updn.get(1)));
			list_updn.set(1, (list_updn.get(2)));
			list_updn.set(2, (list_updn.get(3)));
			list_updn.set(3, (list_updn.get(4)));
			list_updn.set(4, dto);
			this.checkGapOne(list_updn, list);
		}else
		if(list_updn.size() < 5){
			list_updn.add(dto);
			if(list_updn.size() == 5){
				this.checkGapOne(list_updn, list);
			}
		}
	}
	
	/**
	 * STEP03 : 检验连续5条数据，initListGapOne
	 */
	private void checkGapOne(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list){
		this.dto_k1 = list_updn.get(4);
		this.dto_k2 = list_updn.get(3);
		this.dto_k3 = list_updn.get(2);
		this.dto_k4 = list_updn.get(1);
		this.dto_k5 = list_updn.get(0);
		if(this.dto_k1.getDir() == Mark.From_Btm){
			if(this.dto_k3.getLow() > this.dto_k1.getLow() && this.dto_k3.getLow() > this.dto_k5.getLow()){
				if(this.dto_k4.getHigh() < this.dto_k2.getHigh()){
					list.remove(this.dto_k4);
				}else if(this.dto_k4.getHigh() > this.dto_k2.getHigh()){
					list.remove(this.dto_k2);
				}else if(this.dto_k4.getHigh() == this.dto_k2.getHigh()){
					int a = this.dto_k1.getCno() - this.dto_k3.getCno();
					int b = this.dto_k3.getCno() - this.dto_k5.getCno();
					if(a > b){
						list.remove(this.dto_k2);
					}else if(a < b){
						list.remove(this.dto_k4);
					}else if(a == b){
						if(this.dto_k3.getCno() - this.dto_k4.getCno() > this.dto_k2.getCno() - this.dto_k3.getCno()){
							list.remove(this.dto_k4);
						}else{
							list.remove(this.dto_k2);
						}
					}
				}
				list.remove(this.dto_k3);
			}
		}else{
			if(this.dto_k3.getHigh() < this.dto_k1.getHigh() && this.dto_k3.getHigh() < this.dto_k5.getHigh()){
				if(this.dto_k4.getLow() > this.dto_k2.getLow()){
						list.remove(this.dto_k4);
				}else if(this.dto_k4.getLow() < this.dto_k2.getLow()){
						list.remove(this.dto_k2);
				}else if(this.dto_k4.getLow() == this.dto_k2.getLow()){
					int a = this.dto_k1.getCno() - this.dto_k3.getCno();
					int b = this.dto_k3.getCno() - this.dto_k5.getCno();
					if(a > b){
						list.remove(this.dto_k2);
					}else if(a < b){
						list.remove(this.dto_k4);
					}else if(a == b){
						if(this.dto_k3.getCno() - this.dto_k4.getCno() > this.dto_k2.getCno() - this.dto_k3.getCno()){
							list.remove(this.dto_k4);
						}else{
							list.remove(this.dto_k2);
						}
					}
				}
				list.remove(this.dto_k3);
			}
		}
	}
	
	/**
	 * STEP04 : 在UP或DN时执行特殊情况, 取极值，每次取5点，删除2点
	 */
	final public ArrayList<CandlesDto> removeGapTwo(ArrayList<CandlesDto> list, int num){
		if(list.size() > ParamFx.getSingleInstance().getFx_step04()){
			this.flag = true;
			this.cno = num;
			return this.removeGapTwoRec(list); 
		}else{
			return list;
		}
	}
	
	/**
	 * STEP04 : 
	 */
	final private ArrayList<CandlesDto> removeGapTwoRec(ArrayList<CandlesDto> list){
		if(this.flag){
			this.list_updn.clear();
			this.it_k = list.iterator();
			ArrayList<CandlesDto> rs = new ArrayList<CandlesDto>();
			rs.addAll(list);
			this.cno--;
			while(this.it_k.hasNext()){
				this.initListGapTwo(this.list_updn, rs, this.it_k.next());	//填充this.rs
			}
			if(this.cno == 0){
				this.flag = false;
			}
			return this.removeGapTwoRec(rs);
		}else{
			return list;
		}
	}
	/**
	 * STEP04 : 每次取5条数据 removeGapOneRec
	 */
	final private void initListGapTwo(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list, CandlesDto dto){
		if(list_updn.size() == 5){
			list_updn.set(0, (list_updn.get(1)));
			list_updn.set(1, (list_updn.get(2)));
			list_updn.set(2, (list_updn.get(3)));
			list_updn.set(3, (list_updn.get(4)));
			list_updn.set(4, dto);
			this.checkGapTwo(list_updn, list);
		}else
		if(list_updn.size() < 5){
			list_updn.add(dto);
			if(list_updn.size() == 5){
				this.checkGapTwo(list_updn, list);
			}
		}
	}
	/**
	 * STEP04 :
	 */
	private void checkGapTwo(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list){
		this.dto_k1 = list_updn.get(4);
		this.dto_k2 = list_updn.get(3);
		this.dto_k3 = list_updn.get(2);
		this.dto_k4 = list_updn.get(1);
		this.dto_k5 = list_updn.get(0);
	
		if(this.dto_k1.getDir() == Mark.From_Top){
			if(this.dto_k5.getHigh() >= this.dto_k3.getHigh() && this.dto_k4.getLow() < this.dto_k2.getLow() && this.dto_k1.getHigh() > this.dto_k5.getHigh()){
				list.remove(this.dto_k2);
				list.remove(this.dto_k3);
			}else if(this.dto_k1.getHigh() >= this.dto_k3.getHigh() && this.dto_k4.getLow() > this.dto_k2.getLow() && this.dto_k1.getHigh() < this.dto_k5.getHigh()){
				list.remove(this.dto_k3);
				list.remove(this.dto_k4);
			}
		}else{
			if(this.dto_k3.getLow() >= this.dto_k5.getLow() && this.dto_k2.getHigh() < this.dto_k4.getHigh() && this.dto_k5.getLow() > this.dto_k1.getLow()){
				list.remove(this.dto_k2);
				list.remove(this.dto_k3);
			}else if(this.dto_k3.getLow() >= this.dto_k1.getLow() && this.dto_k2.getHigh() > this.dto_k4.getHigh() && this.dto_k5.getLow() < this.dto_k1.getLow()){
				list.remove(this.dto_k3);
				list.remove(this.dto_k4);
			}
		}
	}
	
	/**
	 * STEP05 : 去掉连续两个顶小于底，每次取2点，删除2点
	 */
	final public ArrayList<CandlesDto> removeGapThree(ArrayList<CandlesDto> list){
		this.it_k = list.iterator();
		this.list = new ArrayList<CandlesDto>();
		while(this.it_k.hasNext()){
			this.removeGapThree(this.it_k.next(), this.list);
		}
		return this.list;
	}
	
	/**
	 *  STEP05 ： a在b前
	 */
	final private void removeGapThree(CandlesDto dto, ArrayList<CandlesDto> list){
		if(list.isEmpty()){
			list.add(dto);
			return;
		}
		this.dto_k = list.get(list.size()-1);
		if(this.dto_k.getDir() == Mark.From_Btm && dto.getDir() == Mark.From_Top){
			if(this.dto_k.getLow() < dto.getHigh()){
				list.add(dto);
			}else{
				list.remove(this.dto_k);
			}
		}else 
		if(this.dto_k.getDir() == Mark.From_Top && dto.getDir() == Mark.From_Btm){
			if(this.dto_k.getHigh() > dto.getLow()){
				list.add(dto);
			}else{
				list.remove(this.dto_k);
			}
		}
	}
	/**
	 * STEP06 & STEP07: 
	 */
	final public ArrayList<CandlesDto> removeGapFour(ArrayList<CandlesDto> list, int num){
		//ArrayList<CandlesDto> rs = new ArrayList<CandlesDto>();
		this.list = list;
		while(num > 0){
			this.list = this.removeGapFour(this.list);
			num--;
		}
		return this.list;
	}

	final private ArrayList<CandlesDto> removeGapFour(ArrayList<CandlesDto> list){
		this.list_updn.clear();
		this.it_k = list.iterator();
		this.list = new ArrayList<CandlesDto>();
		this.list.addAll(list);
		while(this.it_k.hasNext()){
			this.initListGapFour(this.list_updn, this.list, this.it_k.next());	//填充this.list
		}
		return this.list;
	}
	/**
	 * STEP06 : 
	 */
	final private void initListGapFour(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list, CandlesDto dto){
		if(list_updn.size() == 4){
			list_updn.set(0, (list_updn.get(1)));
			list_updn.set(1, (list_updn.get(2)));
			list_updn.set(2, (list_updn.get(3)));
			list_updn.set(3, dto);
			this.checkGapFour(list_updn, list);
		}else
		if(list_updn.size() < 4){
			list_updn.add(dto);
			if(list_updn.size() == 4){
				this.checkGapFour(list_updn, list);
			}
		}
	}
	private void checkGapFour(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list){
		this.dto_k1 = list_updn.get(3);
		this.dto_k2 = list_updn.get(2);
		this.dto_k3 = list_updn.get(1);
		this.dto_k4 = list_updn.get(0);
		this.size = Data.paramFx.getFx_step05();
//		if(1.2804 == this.dto_k3.getHigh() && 1.2805 == this.dto_k2.getHigh()){
//			System.out.println("t1:" + this.dto_k1.getTime() + " t2:" + this.dto_k2.getTime() + " t3:" + this.dto_k3.getTime() + " t4:" + this.dto_k4.getTime());
//		}
		//STEP06
		if(this.dto_k1.getDir() == Mark.From_Btm){
			if(this.dto_k2.getHigh() <= this.dto_k4.getHigh() && this.dto_k1.getLow() < this.dto_k3.getLow() || this.dto_k2.getHigh() < this.dto_k4.getHigh() && this.dto_k1.getLow() <= this.dto_k3.getLow()){
				if(this.dto_k1.getCno()-this.dto_k3.getCno()<= this.size || this.dto_k2.getCno()-this.dto_k4.getCno()<= this.size){
					list.remove(this.dto_k2);
					list.remove(this.dto_k3);
				}
			}
		}else{
			if(this.dto_k1.getHigh() >= this.dto_k3.getHigh() && this.dto_k4.getLow() < this.dto_k2.getLow() || this.dto_k1.getHigh() > this.dto_k3.getHigh() && this.dto_k4.getLow() < this.dto_k2.getLow()){
				if(this.dto_k1.getCno()-this.dto_k3.getCno()<= this.size || this.dto_k2.getCno()-this.dto_k4.getCno()<= this.size){
					list.remove(this.dto_k2);
					list.remove(this.dto_k3);
				}
			}
		}
		//STEP07
		if(this.dto_k2.getCno()-this.dto_k3.getCno() == 1){
			if(this.dto_k1.getDir() == Mark.From_Btm){
				if(this.dto_k2.getHigh() < this.dto_k4.getHigh() && this.dto_k1.getLow() < this.dto_k3.getLow()){
					list.remove(this.dto_k2);
					list.remove(this.dto_k3);
				}
			}else{
				if(this.dto_k1.getHigh() > this.dto_k3.getHigh() && this.dto_k4.getLow() < this.dto_k2.getLow()){
					list.remove(this.dto_k2);
					list.remove(this.dto_k3);
				}
			}
		}
	}
	
	/**
	 * STEP06-1 : 
	 */
	final public ArrayList<CandlesDto> removeGapFour_one(ArrayList<CandlesDto> list, int size){
		this.size = size;
		this.list_updn.clear();
		this.it_k = list.iterator();
		this.list = new ArrayList<CandlesDto>();
		this.list.addAll(list);
		while(this.it_k.hasNext()){
			this.initListGapFour_0ne(this.list_updn, this.list, this.it_k.next());	//填充this.list
		}
		return this.list;
	}
	final private void initListGapFour_0ne(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list, CandlesDto dto){
		if(list_updn.size() == 5){
			list_updn.set(0, (list_updn.get(1)));
			list_updn.set(1, (list_updn.get(2)));
			list_updn.set(2, (list_updn.get(3)));
			list_updn.set(3, (list_updn.get(4)));
			list_updn.set(4, dto);
			this.checkGapFour_0ne(list_updn, list);
		}else
		if(list_updn.size() < 5){
			list_updn.add(dto);
			if(list_updn.size() == 5){
				this.checkGapFour_0ne(list_updn, list);
			}
		}
	}
	private void checkGapFour_0ne(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list){
		this.dto_k1 = list_updn.get(4);
		this.dto_k2 = list_updn.get(3);
		this.dto_k3 = list_updn.get(2);
		this.dto_k4 = list_updn.get(1);
		this.dto_k5 = list_updn.get(0);
		this.size = Data.paramFx.getFx_step06();
		if(this.dto_k2.getCno() - this.dto_k4.getCno() <= this.size){
			if(this.dto_k1.getDir() == Mark.From_Btm){
				if(this.dto_k3.getLow() > this.dto_k1.getLow() && this.dto_k3.getLow() > this.dto_k5.getLow()){
					if(this.dto_k2.getHigh() > this.dto_k4.getHigh()){
						list.remove(this.dto_k4);
					}else if(this.dto_k2.getHigh() < this.dto_k4.getHigh()){
						list.remove(this.dto_k2);
					}else if((this.dto_k1.getCno() - this.dto_k2.getCno() + Maths.alsSubPrice(this.dto_k1.getLow(), this.dto_k2.getHigh())) > (this.dto_k4.getCno() - this.dto_k5.getCno() + Maths.alsSubPrice(this.dto_k4.getHigh(), this.dto_k5.getLow()))){
						list.remove(this.dto_k4);
					}else{
						list.remove(this.dto_k2);
					}
					list.remove(this.dto_k3);
				}
			}else if(this.dto_k3.getHigh() < this.dto_k1.getHigh() && this.dto_k3.getHigh() < this.dto_k5.getHigh()){
				if(this.dto_k2.getLow() > this.dto_k4.getLow()){
					list.remove(this.dto_k2);
				}else if(this.dto_k2.getHigh() < this.dto_k4.getHigh()){
					list.remove(this.dto_k4);
				}else if((this.dto_k1.getCno() - this.dto_k2.getCno() + Maths.alsSubPrice(this.dto_k1.getLow(), this.dto_k2.getHigh())) > (this.dto_k4.getCno() - this.dto_k5.getCno() + Maths.alsSubPrice(this.dto_k4.getHigh(), this.dto_k5.getLow()))){
					list.remove(this.dto_k4);
				}else{
					list.remove(this.dto_k2);
				}
				list.remove(this.dto_k3);
			}
		}
	}
	
	/**
	 * 处理最新点
	 */
	public ArrayList<CandlesDto> endList(ArrayList<CandlesDto> list, CandlesDto dto){
		this.last = list.size();
		if(list.get(this.last-1).getCno() - list.get(this.last-2).getCno() == 1){
			list.remove(this.last-1);
		}
		this.dto_k = list.get(list.size() - 1);
		if(this.dto_k.getDir() == Mark.From_Top){
			if(dto.getHigh() > this.dto_k.getHigh()){
				dto.setDir(Mark.From_Top);
				list.add(dto);
			}
		}else{
			if(dto.getLow() < this.dto_k.getLow()){
				dto.setDir(Mark.From_Btm);
				list.add(dto);
			}
		}
		return list;
	}
}
