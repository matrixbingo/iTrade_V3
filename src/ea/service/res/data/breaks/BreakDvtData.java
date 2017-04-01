package ea.service.res.data.breaks;

import ea.service.res.dto.FenBiInfoDto;
/**
 * 仅针对突破最近的背离点
 */
public class BreakDvtData {
	private static BreakDvtData singleInstance = null;
	private double up_05 = 0, up_10 = 0, dn_05 = 0, dn_10 = 0;	//背离使用
	private FenBiInfoDto up_fxDto_05 = null, up_fxDto_10 = null, dn_fxDto_05 = null, dn_fxDto_10 = null;
	
	final public static BreakDvtData getSingleInstance(){
		if (singleInstance == null) {
			synchronized (BreakDvtData.class) {
				if (singleInstance == null) {
					singleInstance = new BreakDvtData();
				}
			}
		}
		return singleInstance;
	}

	final public double getUp_05() {
		return up_05;
	}

	final public void setUp_05(double up_05) {
		this.up_05 = up_05;
	}

	final public double getUp_10() {
		return up_10;
	}

	final public void setUp_10(double up_10) {
		this.up_10 = up_10;
	}

	final public double getDn_05() {
		return dn_05;
	}

	final public void setDn_05(double dn_05) {
		this.dn_05 = dn_05;
	}

	final public double getDn_10() {
		return dn_10;
	}

	final public void setDn_10(double dn_10) {
		this.dn_10 = dn_10;
	}

	final public FenBiInfoDto getUp_fxDto_05() {
		return up_fxDto_05;
	}

	final public void setUp_fxDto_05(FenBiInfoDto up_fxDto_05) {
		this.up_fxDto_05 = up_fxDto_05;
	}

	final public FenBiInfoDto getUp_fxDto_10() {
		return up_fxDto_10;
	}

	final public void setUp_fxDto_10(FenBiInfoDto up_fxDto_10) {
		this.up_fxDto_10 = up_fxDto_10;
	}

	final public FenBiInfoDto getDn_fxDto_05() {
		return dn_fxDto_05;
	}

	final public void setDn_fxDto_05(FenBiInfoDto dn_fxDto_05) {
		this.dn_fxDto_05 = dn_fxDto_05;
	}

	final public FenBiInfoDto getDn_fxDto_10() {
		return dn_fxDto_10;
	}

	final public void setDn_fxDto_10(FenBiInfoDto dn_fxDto_10) {
		this.dn_fxDto_10 = dn_fxDto_10;
	}
}
