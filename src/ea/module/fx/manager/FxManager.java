package ea.module.fx.manager;

import ea.module.fx.control.FxServer;
import ea.module.fx.util.Util_fx;
import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.*;
import ea.service.res.dto.macd.MacdDto;
import ea.service.res.dto.macd.MacdPointDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Maths;
import ea.service.utils.comm.Util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;

@SuppressWarnings("unused")
public class FxManager extends FxServer{
	private static FxManager singleInstance = null;
	private static HashMap<Integer, FxManager> instances = new HashMap<Integer, FxManager>();
	private PriceDto p_dto = new PriceDto();
	private FxMacdDto fm_dto = null;
	private FenBiInfoDto f_dto = null;
	private MacdDto		 m_dto = null;
	private MacdPointDto mh = null, ml = null;
	private Util_fx util_fx = null;
	private FxMacdDto dto_fx = new FxMacdDto();
	private CandlesDto dto_k = null, dto_k1 = null, dto_k2 = null, dto_k3 = null, dto_c1 = null, dto_c2 = null, dto_c3 = null, dto_c4 = null, dto_last = null;
	private double p = 0, max = 0, min = 0;
	private String key = null;
	private ArrayList<Integer> cnos = new ArrayList<Integer>();
	private ArrayList<CandlesDto> repeats = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> list = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> rs = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> list_updn = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> list_dn = new ArrayList<CandlesDto>();
	private ArrayList<CandlesDto> list_up = new ArrayList<CandlesDto>();
	private Iterator<CandlesDto> it_k = null;
	private Iterator<CandlesDto> it_k1 = null;
	private ArrayList<FxDto> list_fx = new ArrayList<FxDto>();
	private int cno, period, dir, bin_cno, end_cno, last;
	
	final public static FxManager getSingleInstance(int key){
		singleInstance = instances.get(key);
		if(null != singleInstance){
			return singleInstance;
		}else{
			singleInstance = new FxManager();
			instances.put(key, singleInstance);
		}
		return singleInstance;
	}

	private FxManager(){
		this.util_fx = new Util_fx();
	}
	/**
	 * 得到第一个顶点是dir的FxMacdDto : 定向判断
	 */
	final public FxMacdDto getFxMacdDto(int period, FenBiInfoDto fxDto){
		if(period == fxDto.getPeriod()){
			return this.getFxMacdDto(fxDto.getPeriod(), fxDto.getDir(), fxDto.getC5(), fxDto.getC1());
		}
		this.end_cno = Data.pageManager.getCandlesDtoByTime(period, fxDto.getT1()).getCno();
		this.bin_cno = Data.pageManager.getCandlesDtoByTime(period, fxDto.getT3()).getCno();
		return Data.fxManager.getFxMacdDto(period, fxDto.getDir(), this.bin_cno, this.end_cno);
	}
	/**
	 * 得到第一个顶点是dir的FxMacdDto : 定向判断
	 */
	final public FxMacdDto getFxMacdDto(int period, int dir, int bin_cno, int end_cno){
		this.intData(period, dir, bin_cno, end_cno);
		this.list = this.creatBaseData(period, dir, bin_cno, end_cno, true);	//01
		if(null == this.list){
			return null;
		}
		this.list = this.removeRepeat(this.list);								//02
		
		this.list = this.util_fx.removeGapOne(this.list, Data.paramFx.getFx_step01());					//03
		
		this.list = this.util_fx.removeGapTwo(this.list, Data.paramFx.getFx_step02());					//04
		
		this.list = this.util_fx.removeGapThree(this.list);						//05
		
		this.list = this.util_fx.removeGapFour_one(this.list, 2);				//06-1
		this.list = this.util_fx.removeGapFour(this.list, 2);					//06
		
		if(Controller.isFxSave){
			Data.exeDataControl.exeSql("delete from t_form where period = " + period + ";");
			this.saveFrom(this.list);				
		}
		return this.getFxMacdDto(this.list);
	}
	
	/**
	 * 得到FxMacdDto : 不定向判断
	 */
	final public FxMacdDto getFxMacdDto(int period, int bin_cno, int end_cno){
		if(bin_cno < 1){
			return null;
		}
		this.intData(period, Mark.No_Dir, bin_cno, end_cno);
		this.list = this.creatBaseData(period, Mark.No_Dir, bin_cno, end_cno, false);	//01
		if(null == this.list){
			return null;
		}
		
		this.list = this.removeRepeat(this.list);										//02
		
		this.list = this.util_fx.removeGapOne(this.list, Data.paramFx.getFx_step01());	//03
		
		this.list = this.util_fx.removeGapTwo(this.list, Data.paramFx.getFx_step02());	//04
		
		this.list = this.util_fx.removeGapThree(this.list);								//05
		
		this.list = this.util_fx.removeGapFour_one(this.list, 2);						//06-1
		this.list = this.util_fx.removeGapFour(this.list, 2);							//06 & 07

		this.list = this.util_fx.endList(this.list, this.dto_last);
		this.list = this.removeRepeat(this.list);	
//
//		//存到数据库
//		if(Controller.isFxSave && !Controller.isDbFx){
//			Data.exeDataControl.exeSql("delete from t_form where period = " + period + ";");
//			this.saveFrom(this.list);				
//		}
/*		if(period == 30){
			System.out.println(period + " -----------> " + end_cno);
		}else{
			System.out.println(period + " -----------> " + end_cno);
		}*/
	
		return this.getFxMacdDto(this.list);
	}
	final private void intData(int period, int dir, int bin_cno, int end_cno){
		this.period = period;
		this.dir = dir;
		this.bin_cno = bin_cno;
		this.end_cno = end_cno;
	}
	/**
	 *  STEP01 ：初始化基本图形A和B
	 */
	final private ArrayList<CandlesDto> creatBaseData(int period, int dir, int bin_cno, int end_cno, boolean isdealBin){
		this.cno = bin_cno;
		this.cnos.clear();
		this.repeats.clear();
		this.list_updn = new ArrayList<CandlesDto>();
		
		//STEP01 ：合并
//		while(this.cno <= end_cno){
//			
//			this.dto_k = super.getMapByPeriod(period).get(this.cno);
//			this.rs.add(this.dto_k);
//			this.cno++;
//		}
//		this.mergerRepeat(this.rs);
//		
//		//STEP01
//		this.it_k = this.rs.iterator();
//		while(this.it_k.hasNext()){
//			this.dto_k2 = this.it_k.next();
//			this.initList(this.list_dn, this.list_up, this.dto_k2);
//		}
//		this.dto_k1 = this.rs.get(this.rs.size() - 2);
		
		while(this.cno <= end_cno){
			this.dto_k2 = super.getMapByPeriod(period).get(this.cno);
			if(this.cno == end_cno-1){
				this.dto_k1 = super.getMapByPeriod(period).get(this.cno);
			}
			this.initList(this.list_dn, this.list_up, this.dto_k2);
			this.cno++;
		}
		this.dto_last = this.dto_k2;
		Util.sort(this.list_updn);
		this.dealSamePoints(this.list_updn, this.repeats);
		this.dto_k3 = this.list_updn.get(this.list_updn.size() - 1);
		if(null == this.dto_k2){
			return null;
		}
		//S0107 : 先清空同时满足的情况
		int flag = 0;
		if(this.dto_k1.getCno() == this.dto_k3.getCno()){
			this.dto_k = this.dto_k3;
			this.list_updn.remove(this.list_updn.size() - 1);
			this.dto_k3 = this.list_updn.get(this.list_updn.size() - 1);
			flag = 1;
		}
		
		//处理开始点 新旧顺序:k2,k1,k3
		if(isdealBin){
			this.dto_k2.setType(3);
			if(this.last != end_cno){
				switch(dir){
					case Mark.From_Btm : if(this.dto_k1.getLow() > this.dto_k2.getLow()){
											this.dto_k2.setDir(Mark.From_Btm);
											this.list_updn.add(this.dto_k2);
										 }
						break;
					case Mark.From_Top : if(this.dto_k1.getHigh() < this.dto_k2.getHigh()){
											this.dto_k2.setDir(Mark.From_Top);
											this.list_updn.add(this.dto_k2);
										 }
						break;
				}
			}
		}else{
			if(this.dto_k1.getCno() != this.dto_k3.getCno()){
				//S0106	: 优先判断
				if(this.dto_k2.getHigh() > this.dto_k1.getHigh() && this.dto_k2.getLow() < this.dto_k1.getLow()){
					if(this.dto_k3.getDir() == Mark.From_Top){
						this.dto_k2.setDir(Mark.From_Btm);
						this.list_updn.add(this.dto_k2);
					}else{
						this.dto_k2.setDir(Mark.From_Top);
						this.list_updn.add(this.dto_k2);
					}
				}
				//S0107
				else if(flag == 1 && this.dto_k2.getHigh() >= this.dto_k1.getHigh() && this.dto_k2.getLow() > this.dto_k1.getLow()){
					if(this.dto_k3.getDir() == Mark.From_Top){
						this.dto_k1.setDir(Mark.From_Btm);
						this.list_updn.add(this.dto_k1);
					}else{
						this.dto_k2.setDir(Mark.From_Top);
						this.list_updn.add(this.dto_k2);
					}
				}
				else if(flag == 1 && this.dto_k2.getLow() <= this.dto_k1.getLow() && this.dto_k2.getHigh() < this.dto_k1.getHigh()){
					if(this.dto_k3.getDir() == Mark.From_Top){
						this.dto_k2.setDir(Mark.From_Btm);
						this.list_updn.add(this.dto_k2);
					}else{
						this.dto_k1.setDir(Mark.From_Top);
						this.list_updn.add(this.dto_k1);
					}
				}
				//S0102
				else if(this.dto_k2.getHigh() > this.dto_k1.getHigh() && this.dto_k2.getLow() >= this.dto_k1.getLow()){
					this.dto_k2.setDir(Mark.From_Top);
					this.list_updn.add(this.dto_k2);
				}
				else if(this.dto_k2.getLow() < this.dto_k1.getLow() && this.dto_k2.getHigh() <= this.dto_k1.getHigh()){
					this.dto_k2.setDir(Mark.From_Btm);
					this.list_updn.add(this.dto_k2);
				}
				//S0103
				else if(this.dto_k2.getHigh() == this.dto_k1.getHigh() && this.dto_k1.getHigh() > this.dto_k3.getHigh() && this.dto_k1.getLow() >= this.dto_k3.getLow() && this.dto_k2.getLow() > this.dto_k3.getLow()){
					this.dto_k2.setDir(Mark.From_Top);
					this.list_updn.add(this.dto_k2);
				}
				else if(this.dto_k2.getLow() == this.dto_k3.getLow() && this.dto_k1.getLow() < this.dto_k3.getLow() && this.dto_k1.getHigh() <= this.dto_k3.getHigh() && this.dto_k2.getHigh() < this.dto_k3.getHigh()){
					this.dto_k2.setDir(Mark.From_Btm);
					this.list_updn.add(this.dto_k2);
				}
				//S0104
				else if(this.dto_k2.getLow() < this.dto_k1.getLow() && this.dto_k1.getLow() < this.dto_k3.getLow()){
					this.dto_k2.setDir(Mark.From_Btm);
					this.list_updn.add(this.dto_k2);
				}
				else if(this.dto_k2.getHigh() > this.dto_k1.getHigh() && this.dto_k1.getHigh() > this.dto_k3.getHigh()){
					this.dto_k2.setDir(Mark.From_Top);
					this.list_updn.add(this.dto_k2);
				}
				
			}
		}
		
		if(flag == 1 && this.list_updn.get(this.list_updn.size() - 1).getCno() < this.dto_k.getCno()){
			this.list_updn.add(this.dto_k);
		}
		
		this.list_dn.clear();
		this.list_up.clear();
		return this.list_updn;
	}
	
	/**
	 * STEP01 ：合并
	 */
	final private void mergerRepeat(ArrayList<CandlesDto> list){
		this.cnos.clear();
		//获取合并cno
		for(int i = 0; i < list.size() - 2; i++){
			this.dto_k1 = list.get(i + 1);
			this.dto_k2 = list.get(i);

			if(this.dto_k1.getHigh() >= this.dto_k2.getHigh() && this.dto_k1.getLow() <= this.dto_k2.getLow()){
				if(!this.cnos.contains(this.dto_k2.getCno())){
					this.cnos.add(this.dto_k2.getCno());
				}
			}else if(this.dto_k2.getHigh() >= this.dto_k1.getHigh() && this.dto_k2.getLow() <= this.dto_k1.getLow()){
				if(!this.cnos.contains(this.dto_k1.getCno())){
					this.cnos.add(this.dto_k1.getCno());
				}
			}
		}
		//合并
		Iterator<CandlesDto> it = list.iterator();
		while(it.hasNext()){
			this.dto_k = it.next();
		    if(this.cnos.contains(this.dto_k.getCno())){  
		        it.remove();
		    }  
		}
		this.cnos.clear();
	}
	
	/**
	 * STEP01 ：初始化基本图形A和B，每次取K三个比较
	 */
	final private void initList(ArrayList<CandlesDto> list_dn, ArrayList<CandlesDto> list_up, CandlesDto dto){
		if(null == dto){
			return;
		}
		//--- DN 3, 2, 1, 0
		if(list_dn.size() == 3 && list_dn.get(2).getLow() != dto.getLow()){
			list_dn.set(0, (list_dn.get(1)));
			list_dn.set(1, (list_dn.get(2)));
			list_dn.set(2, dto);
			this.checkBaseChart(Mark.From_Btm, list_dn);
		}else
		if(list_dn.size() == 2 && list_dn.get(1).getLow() != dto.getLow()){
			list_dn.add(2, dto);
			this.checkBaseChart(Mark.From_Btm, list_dn);
		}else
		if(list_dn.size() == 1 && list_dn.get(0).getLow() != dto.getLow()){
			list_dn.add(1, dto);
		}else
		if(list_dn.size() == 0){
			list_dn.add(0, dto);
		}
		//--- UP 3, 2, 1, 0
		if(list_up.size() == 3 && list_up.get(2).getHigh() != dto.getHigh()){
			list_up.set(0, (list_up.get(1)));
			list_up.set(1, (list_up.get(2)));
			list_up.set(2, dto);
			this.checkBaseChart(Mark.From_Top, list_up);
		}else
		if(list_up.size() == 2 && list_up.get(1).getHigh() != dto.getHigh()){
			list_up.add(2, dto);
			this.checkBaseChart(Mark.From_Top, list_up);
		}else
		if(list_up.size() == 1 && list_up.get(0).getHigh() != dto.getHigh()){
			list_up.add(1, dto);
		}else
		if(list_up.size() == 0){
			list_up.add(0, dto);
		}
	}
	
	/**
	 * STEP01 ： 基本图形list长度为三
	 */
	final private void checkBaseChart(int type, ArrayList<CandlesDto> list){
		if(list.size() == 3){
			this.dto_k = list.get(1);
			if(type == Mark.From_Top && this.dto_k.getHigh() > list.get(0).getHigh() && this.dto_k.getHigh() > list.get(2).getHigh()){
				this.dto_k.setDir(Mark.From_Top);
				this.dto_k.setType(3);
				this.last = this.dto_k.getCno();
				//--- 去重复
				if(!this.cnos.contains(this.dto_k.getCno())){
					this.list_updn.add(this.dto_k);
					this.cnos.add(this.dto_k.getCno());
				}else if(!this.cnos.isEmpty() && this.cnos.contains(this.dto_k.getCno())){
					this.repeats.add(this.dto_k);
				}
			}else
			if(type == Mark.From_Btm && this.dto_k.getLow() < list.get(0).getLow() && this.dto_k.getLow() < list.get(2).getLow()){
				this.dto_k.setDir(Mark.From_Btm);
				this.dto_k.setType(3);
				this.last = this.dto_k.getCno();
				//--- 去重复
				if(!this.cnos.contains(this.dto_k.getCno())){
					this.list_updn.add(this.dto_k);
					this.cnos.add(this.dto_k.getCno());
				}else if(!this.cnos.isEmpty() && this.cnos.contains(this.dto_k.getCno())){
					this.repeats.add(this.dto_k);
				}
			}
		}
	}
	/**
	 * STEP01 ： 处理同一个点极是UP又是DN的情况
	 */
	final private void dealSamePoints(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list){
		this.it_k = list.iterator();
		while(this.it_k.hasNext()){
			this.dealSamePoints(list_updn, this.it_k.next());
		}
	}
	final private void dealSamePoints(ArrayList<CandlesDto> list_updn, CandlesDto dto){
		this.it_k1 = list_updn.iterator();
		while(this.it_k1.hasNext()){
			this.dto_k3 = this.it_k1.next();
			if(this.dto_k3.getCno() == dto.getCno()){
				int cno_repeat = list_updn.indexOf(this.dto_k3);
				this.dto_c1 = super.getMapByPeriod(this.period).get(dto.getCno() + 2);
				this.dto_c2 = super.getMapByPeriod(this.period).get(dto.getCno() + 1);
				this.dto_c3 = super.getMapByPeriod(this.period).get(dto.getCno() - 1);
				this.dto_c4 = super.getMapByPeriod(this.period).get(dto.getCno() - 2);
				if(
						(this.dto_c4.getLow()  	>= this.dto_c3.getLow()  && this.dto_c1.getLow()  >= this.dto_c2.getLow())
					||  (this.dto_c4.getLow()  	>  this.dto_c3.getLow()  && this.dto_c1.getHigh() >  this.dto_c2.getHigh())
					||  (this.dto_c4.getHigh() 	>  this.dto_c3.getHigh() && this.dto_c1.getLow()  >  this.dto_c2.getLow())
					||  (this.dto_k3.getClose() >  this.dto_c3.getOpen())
				 ){
					this.dto_k3.setDir(Mark.From_Btm);
					list_updn.set(cno_repeat, this.dto_k3);
				}else 
				if(
						(this.dto_c4.getHigh() 	<= this.dto_c3.getHigh()  && this.dto_c1.getHigh() <= this.dto_c2.getHigh())
					||  (this.dto_c4.getLow()  	<  this.dto_c3.getLow()   && this.dto_c1.getHigh() <  this.dto_c2.getHigh())
					||  (this.dto_c4.getHigh() 	<  this.dto_c3.getHigh()  && this.dto_c1.getLow()  <  this.dto_c2.getLow())
					||  (this.dto_k3.getClose() <  this.dto_c3.getOpen())
				 ){
					this.dto_k3.setDir(Mark.From_Top);
					list_updn.set(cno_repeat, this.dto_k3);
				}
			}
		}
	}
	/**
	 * STEP02 ：去除连续相同类型的重复项，取极值
	 */
	private ArrayList<CandlesDto> removeRepeat(ArrayList<CandlesDto> list){
		boolean flag = true;
		this.it_k = list.iterator();
		this.list = new ArrayList<CandlesDto>();
		while(this.it_k.hasNext()){
			if(flag){
				this.dto_k = this.it_k.next();
				flag = false;
			}
			this.dto_k1 = this.removeRepeat(this.dto_k, this.it_k.next(), list);
			if(null != this.dto_k1){
				this.dto_k = this.dto_k1;
			}
			if(!this.list.contains(this.dto_k)){
				this.list.add(this.dto_k);
			}
		}
		return this.list;
	}
	
	/**
	 *  STEP02 ：相同方向连续类型取极值去掉其他 a在b前
	 */
	private CandlesDto removeRepeat(CandlesDto a, CandlesDto b, ArrayList<CandlesDto> list){
		if(a.getDir() == b.getDir()){
			if(this.dto_k.getDir() == Mark.From_Btm){
				if(b.getLow()  <  a.getLow()){
					if(this.list.contains(a)){
						Collections.replaceAll(this.list, a, b);
					}
					return b;
				}else if(b.getLow() == a.getLow()){
					int index1 = list.indexOf(a)-1;
					int index2 = list.indexOf(b)+1; 
					if(index1 >= 0 && index2 <= list.size()-1){
						this.dto_k1 = list.get(index1);
						this.dto_k2 = list.get(index2);
						if((a.getCno() - this.dto_k1.getCno() + Maths.alsSubPrice(a.getLow(), this.dto_k1.getFxPole())) > (this.dto_k2.getCno() - b.getCno() + Maths.alsSubPrice(b.getLow(), this.dto_k2.getFxPole()))){
							if(this.list.contains(a)){
								Collections.replaceAll(this.list, a, b);
							}
							return b;
						}else{
							return null;
						}
					}else{
						return null;
					}
				}else{
					return null;
				}
			}else{
				if(b.getHigh() > a.getHigh()){
					if(this.list.contains(a)){
						Collections.replaceAll(this.list, a, b);
					}
					return b;
				}else if(b.getHigh() == a.getHigh()){
					int index1 = list.indexOf(a)-1;
					int index2 = list.indexOf(b)+1; 
					if(index1 >= 0 && index2 <= list.size()-1){
						this.dto_k1 = list.get(index1);
						this.dto_k2 = list.get(index2);
						if((a.getCno() - this.dto_k1.getCno() + Maths.alsSubPrice(a.getHigh(), this.dto_k1.getFxPole())) > (this.dto_k2.getCno() - b.getCno() + Maths.alsSubPrice(b.getHigh(), this.dto_k2.getFxPole()))){
							if(this.list.contains(a)){
								Collections.replaceAll(this.list, a, b);
							}
							return b;
						}else{
							return null;
						}
					}else{
						return null;
					}
				}else{
					return null;
				}
			}
		}
		return b;
	}
	
	/**
	 * 未使用 : 去除间隔为一个的顶底，取极值
	 */
	private ArrayList<CandlesDto> removeGapOne(ArrayList<CandlesDto> list){
		this.list_updn.clear();
		this.rs = new ArrayList<CandlesDto>();
		this.rs.addAll(list);
		this.it_k = list.iterator();
		while(this.it_k.hasNext()){
			this.dto_k = this.it_k.next();
			this.initListGapOne(this.list_updn, this.dto_k);
		}
		return this.rs;
	}
	/**
	 * 未使用 : 去除间隔为一个的顶底，取极值
	 */
	final private void initListGapOne(ArrayList<CandlesDto> list_updn, CandlesDto dto){
		//--- 3
		if(list_updn.size() == 3){
			list_updn.set(2, (list_updn.get(1)));
			list_updn.set(1, (list_updn.get(0)));
			list_updn.set(0, dto);
			this.checkGapOne(list_updn);
		}
		//--- 0,1,2
		if(list_updn.size() < 3){
			list_updn.add(dto);
			if(list_updn.size() == 3){
				this.checkGapOne(list_updn);
			}
		}
	}
	/**
	 * 未使用 : 去除间隔为一个的顶底，取极值
	 */
	private void checkGapOne(ArrayList<CandlesDto> list_updn){
		this.dto_k = list_updn.get(0);
		this.dto_k1 = list_updn.get(2);
		if(this.dto_k.getCno() > 178){
			//System.out.println(this.dto_k.getCno() - this.dto_k1.getCno());
		}
		//System.out.println(this.dto_k.getCno() + " : " + this.dto_k1.getCno());
		if(this.dto_k.getDir() == this.dto_k1.getDir() && this.dto_k.getCno() - this.dto_k1.getCno() <= 2){
			switch(this.dto_k.getDir()){
				case Mark.From_Btm : 
					if(this.dto_k.getLow() < this.dto_k1.getLow()){
						this.rs.remove(this.dto_k1);
					}else{
						this.rs.remove(this.dto_k);
					}
					this.rs.remove(list_updn.get(1));
				break;
				case Mark.From_Top : 
					if(this.dto_k.getHigh() > this.dto_k1.getHigh()){
						this.rs.remove(this.dto_k1);
					}else{
						this.rs.remove(this.dto_k);
					}
					this.rs.remove(list_updn.get(1));
				break;
			}
		}
	}
	
	private void saveFrom(ArrayList<CandlesDto> list){
		this.it_k = list.iterator();
		while(this.it_k.hasNext()){
			this.dto_k = this.it_k.next();
			Data.exeDataControl.addForm(this.dto_k.getPeriod(), this.dto_k.getCno(), this.dto_k.getDir());
			System.out.println(this.dto_k.getPeriod() + " : " + this.dto_k.getCno() + " : " + this.dto_k.getDir());
		}
	}
	
	/**
	 * 未使用 : 去除间隔为一个点的相邻两项 取极值
	 */
	private ArrayList<CandlesDto> removeGapTwo(ArrayList<CandlesDto> list){
		this.list.clear();
		this.list_updn.clear();
		this.list.addAll(list);
		this.it_k = list.iterator();
		while(this.it_k.hasNext()){
			if(this.list_updn.size() > 0){
				if(this.list_updn.size() == 1){
					this.list_updn.add(1, this.list_updn.get(0));
					this.list_updn.set(0, this.it_k.next());
					this.checkGapTwo(this.list_updn, this.list);
				}else{
					this.list_updn.set(1, this.list_updn.get(0));
					this.list_updn.set(0, this.it_k.next());
					this.checkGapTwo(this.list_updn, this.list);
				}
			}
			if(this.list_updn.size() == 0){
				this.list_updn.add(this.it_k.next());
			}
		}
		return this.list;
	}
	/**
	 * 未使用 : 去除间隔为一个点的相邻两项
	 */
	private void checkGapTwo(ArrayList<CandlesDto> list_updn, ArrayList<CandlesDto> list){
		if(list_updn.get(0).getCno() - list_updn.get(1).getCno() == 2){
			list.remove(list_updn.get(0));
			list.remove(list_updn.get(1));
		}
	}
	
	private void checkFirstPoit(ArrayList<CandlesDto> list){
		this.cno = list.size()-1;
		this.dto_k = list.get(this.cno);
		this.dto_k1 = super.getMapByPeriod(this.period).get(this.end_cno);
		int dir = this.dto_k.getDir();
		if(this.dir == Mark.From_Top){
			if(dir == Mark.From_Top){
				if(this.dto_k1.getHigh() > this.dto_k.getHigh()){
					this.dto_k1.setDir(Mark.From_Top);
					this.dto_k1.setType(3);
					list.set(this.cno, this.dto_k1);
				}
			}else{
				if(this.dto_k1.getHigh() > list.get(this.cno-2).getHigh()){
					this.dto_k1.setDir(Mark.From_Top);
					this.dto_k1.setType(3);
					list.set(this.cno, this.dto_k1);
				}
			}
		}
	}

	final private FxMacdDto getFxMacdDto(ArrayList<CandlesDto> list){
		this.cno = list.size();
		if(this.cno >= 4){
			this.fm_dto = new FxMacdDto();
			this.f_dto = new FenBiInfoDto(this.period);
			this.m_dto = new MacdDto();
			this.mh	= new MacdPointDto();
			this.ml	= new MacdPointDto();
			
			this.dto_c1 = list.get(this.cno - 1);
			this.dto_c2 = list.get(this.cno - 2);
			this.dto_c3 = list.get(this.cno - 3);
			this.dto_c4 = list.get(this.cno - 4);
			this.p_dto = this.getMaxMin(this.dto_c2, this.dto_c1);
			this.mh.setF1(this.p_dto.getMaxPrice()); this.ml.setF1(this.p_dto.getMinPrice());
			this.p_dto = this.getMaxMin(this.dto_c3, this.dto_c2);
			this.mh.setF2(this.p_dto.getMaxPrice()); this.ml.setF2(this.p_dto.getMinPrice());
			this.p_dto = this.getMaxMin(this.dto_c4, this.dto_c3);
			this.mh.setF3(this.p_dto.getMaxPrice()); this.ml.setF3(this.p_dto.getMinPrice());
			
			this.f_dto.setType(Mark.Fx_Me);	//fx类型，内存
			this.f_dto.setSize(7);
			this.f_dto.setDir(this.dto_c1.getDir());
			this.f_dto.setC1(this.dto_c1.getCno()); this.f_dto.setT1(this.dto_c1.getTime()); this.f_dto.setP1(this.dto_c1.getFxPole());
			this.f_dto.setC2(this.dto_c2.getCno()); this.f_dto.setT2(this.dto_c2.getTime()); this.f_dto.setP2(this.dto_c2.getFxPole());
			this.f_dto.setC3(this.dto_c3.getCno()); this.f_dto.setT3(this.dto_c3.getTime()); this.f_dto.setP3(this.dto_c3.getFxPole());
			this.f_dto.setC4(this.dto_c4.getCno()); this.f_dto.setT4(this.dto_c4.getTime()); this.f_dto.setP4(this.dto_c4.getFxPole());
			
			this.m_dto.setMh(this.mh);
			this.m_dto.setMl(this.ml);
			
			this.fm_dto.setF_dto(this.f_dto);
			this.fm_dto.setM_dto(this.m_dto);
			Data.conditionFxManager.addFmDto(this.fm_dto);
			return this.fm_dto;
		}
		return null;
	}
	/**
	 * 得到a和b之间的极值
	 */
	final PriceDto getMaxMin(CandlesDto a, CandlesDto b){
		int bin_cno = a.getCno();
		int end_cno = b.getCno();
		boolean flag = true;
		while(bin_cno <= end_cno){
			if(flag){
				this.max = a.getBar();
				this.min = a.getBar();
				flag = false;
			}else{
				this.p = super.getMapByPeriod(this.period).get(bin_cno).getBar();
				if(this.p > this.max){
					this.max = this.p;
				}
				if(this.p < this.min){
					this.min = this.p;
				}
			}
			bin_cno++;
		}
		this.p_dto.setMaxPrice(this.max);
		this.p_dto.setMinPrice(this.min);
		return this.p_dto;
	}
	
	public ArrayList<CandlesDto> getList() {
		return this.list;
	}

	public static void main(String[] agrs){
		//Data.exeDataControl.exeSql("delete from t_form where period = 10;");
		//Data.pageManager.getCandlesDtoByTime(Mark.Period_M30, 20120102213000L);
		//Data.fxManager.getFxMacdDto(Mark.Period_M30, Mark.From_Top, 29, 74);
		//Data.pageManager.getCandlesDtoByTime(Mark.Period_M30, 20120102213000L);
		//Data.fxManager.getFxMacdDto(Mark.Period_M30, Mark.From_Btm, 301, 357);	//273, 327 //87, 222//132, 201
		Data.pageManager.getCandlesDtoByTime(Mark.Period_M05, 20120102213000L);
		Data.fxManager.getFxMacdDto(Mark.Period_M05, 198-60, 198);
	}
}
