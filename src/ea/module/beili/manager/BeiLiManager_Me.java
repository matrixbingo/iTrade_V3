package ea.module.beili.manager;

import ea.module.beili.control.BeiLiServer;
import ea.module.util.UtilModule;
import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.BeiliDto;
import ea.service.res.dto.CandlesDto;
import ea.service.res.dto.FenBiInfoDto;
import ea.service.res.dto.FxMacdDto;
import ea.service.res.dto.macd.MacdDto;
import ea.service.res.dto.macd.MacdPointDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Maths;

/**
 * 添加增量和角度控制
 * @author WL
 * @date 2013-10-23 下午2:53:04
 */
public class BeiLiManager_Me extends BeiLiServer {
	private static BeiLiManager_Me singleInstance = null;
	private BeiliDto dvt_dto = null;
	private boolean isBeili = false;
	private MacdDto m_dto = null;
	private FenBiInfoDto fxDto = null;
	private MacdPointDto mh = null, ml = null;
	private int pole = 0;
	
	public static BeiLiManager_Me getSingleInstance(){
		if (singleInstance == null) {
			synchronized (BeiLiManager_Me.class) {
				if (singleInstance == null) {
					singleInstance = new BeiLiManager_Me();
				}
			}
		}
		return singleInstance;
	}
	
	@Override
	final public BeiliDto isBeiLiByM05(FxMacdDto fm_dto, CandlesDto kData) {
		this.dvt_dto = new BeiliDto(Mark.Period_M05);
		this.isBeili = false;
		int fxCno = 0, dir = Mark.Beili_No, updn = Mark.Beili_No;

		this.m_dto = fm_dto.getM_dto();
		this.fxDto = fm_dto.getF_dto();
		this.mh	= this.m_dto.getMh();
		this.ml	= this.m_dto.getMl();
		
		//M5 顶背离 和 底背离
		if(this.fxDto.getDir() == Mark.From_Top){
			this.pole = this.fxDto.getC1();

			if(Maths.isMaxParice(this.fxDto.getP1(), this.fxDto.getP3(), Controller.m05_kdif1) && Maths.isMaxParice(this.fxDto.getP2(), this.fxDto.getP4(), Controller.m05_kdif2)){
				if(Maths.isMaxParice(this.mh.getF3(), this.mh.getF1(), Controller.m05_mdif1)){
					if(Controller.isDvtBreak){
						Data.breakDvtData.setDn_05(this.fxDto.getP2());
						Data.breakDvtData.setDn_fxDto_05(this.fxDto);
					}
					updn = Mark.Beili_Top;
					dir = Mark.Beili_Dir_1;
					fxCno = this.pole;
					this.isBeili = true;
	
					Data.conditionTactis.setBeili_05_up(true);
					UtilModule.getSingleInstance().setBeiliCheck_One(this.dvt_dto, this.fxDto, this.mh);
				}
			}
			
		}
		
		else if(this.fxDto.getDir() == Mark.From_Btm){
			this.pole = this.fxDto.getC1();
			
			if(Maths.isMaxParice(this.fxDto.getP3(), this.fxDto.getP1(), Controller.m05_kdif1) && Maths.isMaxParice(this.fxDto.getP4(), this.fxDto.getP2(), Controller.m05_kdif2)){ 
				if(Maths.isMaxParice(this.ml.getF1(), this.ml.getF3(), Controller.m05_mdif1)){
					if(Controller.isDvtBreak){
						Data.breakDvtData.setUp_05(this.fxDto.getP2());
						Data.breakDvtData.setUp_fxDto_05(this.fxDto);
					}
					updn = Mark.Beili_Bot;
					dir = Mark.Beili_Dir_1;
					fxCno = this.pole;
					this.isBeili = true;
					Data.conditionTactis.setBeili_05_dn(true);
					
					UtilModule.getSingleInstance().setBeiliCheck_One(this.dvt_dto, this.fxDto, this.ml);
				}
			}
			
		}

		if(this.isBeili == true){
			if(kData.getPeriod() == Mark.Period_M01){	//如果返回不是1分钟则cno存负数
				this.dvt_dto.setDev_cno(kData.getCno());
			}else{
				this.dvt_dto.setDev_cno(-kData.getCno());
			}
			this.dvt_dto.setPrice(updn == Mark.Beili_Top?kData.getHigh():kData.getLow());
			this.dvt_dto.setBeili(this.isBeili);
			this.dvt_dto.setUpdn(updn);
			this.dvt_dto.setTime(kData.getTime());
			this.dvt_dto.setCno(fxCno);
			this.dvt_dto.setDir(dir);
			this.dvt_dto.setFxDto(this.fxDto);
			BeiLiManagerListen.getSingleInstance().listenBeili(this.fxDto, this.dvt_dto, kData);
		}
		return this.dvt_dto;
	}

	@Override
	final protected BeiliDto isBeiLiByM10(FxMacdDto fm_dto, CandlesDto kData) {
		this.isBeili = false;
		int fxCno = 0, dir = Mark.Beili_No, updn = Mark.Beili_No;
		this.dvt_dto = new BeiliDto(Mark.Period_M10);

		this.fxDto = fm_dto.getF_dto();
		this.m_dto = fm_dto.getM_dto();
		this.mh	= this.m_dto.getMh();
		this.ml	= this.m_dto.getMl();
		
		//M10 顶背离 和 底背离
		if(this.fxDto.getDir() == Mark.From_Top){
			this.pole = this.fxDto.getC1();
		
			if(Maths.isMaxParice(this.fxDto.getP1(), this.fxDto.getP3(), Controller.m10_kdif1)&& Maths.isMaxParice(this.fxDto.getP2(), this.fxDto.getP4(), Controller.m10_kdif2)){
			
				if(Maths.isMaxParice(this.mh.getF3(), this.mh.getF1(), Controller.m10_mdif1)){
					if(Controller.isDvtBreak){
						Data.breakDvtData.setDn_10(this.fxDto.getP2());
						Data.breakDvtData.setDn_fxDto_10(this.fxDto);
					}
					updn = Mark.Beili_Top;
					dir = Mark.Beili_Dir_1;
					fxCno = this.pole;
					this.isBeili = true;
	
					Data.conditionTactis.setBeili_10_up(true);
					UtilModule.getSingleInstance().setBeiliCheck_One(this.dvt_dto, this.fxDto, this.mh);
				}
			}
			
		}

		else if(this.fxDto.getDir() == Mark.From_Btm){
			this.pole = this.fxDto.getC1();
			
			if(Maths.isMaxParice(this.fxDto.getP3(), this.fxDto.getP1(), Controller.m10_kdif1) && Maths.isMaxParice(this.fxDto.getP4(), this.fxDto.getP2(), Controller.m10_kdif2)){
				if(Maths.isMaxParice(this.ml.getF1(), this.ml.getF3(), Controller.m10_mdif1)){			
					if(Controller.isDvtBreak){
						Data.breakDvtData.setUp_10(this.fxDto.getP2());
						Data.breakDvtData.setUp_fxDto_10(this.fxDto);
					}
					updn = Mark.Beili_Bot;
					dir = Mark.Beili_Dir_1;
					fxCno = this.pole;
					this.isBeili = true;
					
					Data.conditionTactis.setBeili_10_dn(true);
					UtilModule.getSingleInstance().setBeiliCheck_One(this.dvt_dto, this.fxDto, this.ml);
				}
			}
			
		}

		if(this.isBeili == true){
			if(kData.getPeriod() == Mark.Period_M01){	//如果返回不是1分钟则cno存负数
				this.dvt_dto.setDev_cno(kData.getCno());
			}else{
				this.dvt_dto.setDev_cno(-kData.getCno());
			}
			this.dvt_dto.setPrice(updn==Mark.Beili_Top?kData.getHigh():kData.getLow());
			this.dvt_dto.setBeili(this.isBeili);
			this.dvt_dto.setUpdn(updn);
			this.dvt_dto.setTime(kData.getTime());
			this.dvt_dto.setCno(fxCno);
			this.dvt_dto.setDir(dir);
			this.dvt_dto.setFxDto(this.fxDto);
			BeiLiManagerListen.getSingleInstance().listenBeili(this.fxDto, this.dvt_dto, kData);
		}
		return this.dvt_dto;
	}

	@Override
	final protected BeiliDto isBeiLiByM30(FxMacdDto fm_dto, CandlesDto kData) {
		this.isBeili = false;
		int fxCno = 0, dir = Mark.Beili_No, updn = Mark.Beili_No;
		this.dvt_dto = new BeiliDto(Mark.Period_M30);
	
		this.fxDto = fm_dto.getF_dto();//System.out.println("t "+ this.fxDto.getT1() + " : " + this.fxDto.getT2() + " : " + this.fxDto.getT3()+ " : " + this.fxDto.getT4());
		this.m_dto = fm_dto.getM_dto();
		MacdPointDto mh	= this.m_dto.getMh();
		MacdPointDto ml	= this.m_dto.getMl();
		
		//M30 顶背离 和 底背离
		if(this.fxDto.getDir() == Mark.From_Top){
			this.pole = this.fxDto.getC1();
		
			if(Maths.isMaxParice(this.fxDto.getP1(), this.fxDto.getP3(), Controller.m30_kdif1) && Maths.isMaxParice(this.fxDto.getP2(), this.fxDto.getP4(), Controller.m30_kdif2)){ 
				if(Maths.isMaxParice(mh.getF3(), mh.getF1(), Controller.m30_mdif1)){
					updn = Mark.Beili_Top;
					dir = Mark.Beili_Dir_1;
					fxCno = this.pole;
					this.isBeili = true;
			
					Data.conditionTactis.setBeili_30_up(true);
					UtilModule.getSingleInstance().setBeiliCheck_One(this.dvt_dto, this.fxDto, mh);
				}
			}
			
		}

		else if(this.fxDto.getDir() == Mark.From_Btm){
			this.pole = this.fxDto.getC1();
			
			if(Maths.isMaxParice(this.fxDto.getP3(), this.fxDto.getP1(), Controller.m30_kdif1) && Maths.isMaxParice(this.fxDto.getP4(), this.fxDto.getP2(), Controller.m30_kdif2)){
				if(Maths.isMaxParice(ml.getF1(), ml.getF3(), Controller.m30_mdif1)){
					updn = Mark.Beili_Bot;
					dir = Mark.Beili_Dir_1;
					fxCno = this.pole;
					this.isBeili = true;

					Data.conditionTactis.setBeili_30_dn(true);
					UtilModule.getSingleInstance().setBeiliCheck_One(this.dvt_dto, this.fxDto, ml);
				}
			}
		
		}

		if(this.isBeili == true){
			//如果返回不是1分钟则cno存负数
			if(kData.getPeriod() == Mark.Period_M01){	
				this.dvt_dto.setDev_cno(kData.getCno());
			}else{
				this.dvt_dto.setDev_cno(-kData.getCno());
			}
			this.dvt_dto.setPrice(updn == Mark.Beili_Top?kData.getHigh():kData.getLow());
			this.dvt_dto.setBeili(this.isBeili);
			this.dvt_dto.setUpdn(updn);
			this.dvt_dto.setTime(kData.getTime());
			this.dvt_dto.setCno(fxCno);
			this.dvt_dto.setDir(dir);
			this.dvt_dto.setFxDto(this.fxDto);
			BeiLiManagerListen.getSingleInstance().listenBeili(this.fxDto, this.dvt_dto, kData);
		}
		return this.dvt_dto;
	}
}
	