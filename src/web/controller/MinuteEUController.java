package web.controller;

import ea.server.Data;
import ea.service.res.dto.*;
import ea.service.utils.comm.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import web.utils.WebDataUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/ea")
public class MinuteEUController extends BaseController {

	private FxMacdDto fm_dto;
	private FenBiInfoDto fenBiInfoDto;
	private BeiliDto dto_dvt;
	private CandlesDto dto_k_01;
	private BreakDto breakDto;
	private int size;


	@RequestMapping(value = "/getInitData", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public String getInitData(int period, HttpServletRequest request) {
		String callback = request.getParameter("callback");
		Map<String, Object> map = new HashMap<String, Object>();
		Object[] objs = new Object[6];
		objs[0] = Data.paramFx.getFx_step01() + "";
		objs[1] = Data.paramFx.getFx_step02() + "";
		objs[2] = Data.paramFx.getFx_step03() + "";
		objs[3] = Data.paramFx.getFx_step04() + "";
		objs[4] = Data.dBHandler.getMaxTime(Util.getTabNameByPeriod(period)) + "";
		map.put("data", objs);
		
		String jsonStr = this.obj2Json(map);
		return result(callback, jsonStr);
	}

	/**
	 * 多个参数股票快照数据
	 */
	@RequestMapping(value = "/getMarketByObjs", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public String getMarketByObjs(int period, long time, @RequestParam(value = "size", required = true, defaultValue = "10") String size, HttpServletRequest request) {
		String callback = request.getParameter("callback");

		List<CandlesDto> list = WebDataUtil.getSingleInstance().getCandlesDto(period, time, size);
		Util.sort(list);
		String jsonStr = this.obj2Json(list); //"[{\"time\":\"2014-01-27 17:35:00\",\"obj\":\"SZ002590.stk\",\"stkName\":\"万安科技\",\"open\":\"1.36931\",\"high\":\"1.36948\",\"low\":\"1.36928\",\"price\":\"1.36936\",\"buyPrice\":\"11.33;11.32;11.3;11.28;11.27\",\"sellPrice\":\"11.39;11.4;11.41;11.42;11.43\",\"volume\":\"14820\",\"amount\":\"17013418\",\"updn\":\"-0.17\",\"updnratio\":\"-1.48\",\"lastclose\":\"11.5\",\"buyVolume\":\"7;61;121;25;19\",\"sellVolume\":\"9;28;179;1;151\",\"conceptOfPlateStarLevel\":\"0\"}]"
		return result(callback, jsonStr);
	}

	/**
	 * 查询KLine
	 */
	@RequestMapping(value = "/loadKlineByID", method = {RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public String loadKlineByID(int period, long time, int direction, @RequestParam(value = "size", required = true, defaultValue = "100") int size, HttpServletRequest request) {
		Map<String, Object> map = new HashMap<String, Object>();
		String callback = request.getParameter("callback");
		List<KlinesDto> list = WebDataUtil.getSingleInstance().selectKlineDate(period, time, direction, size);;
		Util.sortKlines(list);
		map.put("title", WebDataUtil.title_Kline);
		map.put("data", WebDataUtil.getSingleInstance().getKlinesData(list));
		System.out.println("list.size---->" + list.size());
		String jsonStr = this.obj2Json(map);
		return result(callback, jsonStr);
	}
	
	/**
	 * 获取fx、实时brk 、 dev
	 */
	@RequestMapping(value = "/loadFxByTime", method = {RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public String loadFxByTime(@RequestParam(value = "period", required = true, defaultValue = "1") int period, long time, @RequestParam(value = "size", required = true, defaultValue = "80") int size, 
			int fx_step01, int fx_step02, int fx_step03, int fx_step04, //int fx_step05,int fx_step06, 
			HttpServletRequest request) {
		//获取fx
		Data.paramFx.setFx_step01(fx_step01);
		Data.paramFx.setFx_step02(fx_step02);
		Data.paramFx.setFx_step03(fx_step03);
		Data.paramFx.setFx_step04(fx_step04);
//		Data.paramFx.setFx_step05(fx_step05);
//		Data.paramFx.setFx_step06(fx_step06);
		this.size = size;
		System.out.println(Data.paramFx.toString());
		Map<String, Object> map = new HashMap<String, Object>();
		String callback = request.getParameter("callback");
		int cno = Data.dBHandler.getCnoByTime(period, time);
		Data.pageManager.getCandlesDtoByTime(period, time);
		this.fm_dto = Data.fxManager.getFxMacdDto(period, cno - size, cno);
		if(null != this.fm_dto){
			this.fenBiInfoDto = this.fm_dto.getF_dto();
			Object[][] objs = this.fenBiInfoDto.getData(Data.fxManager.getList(), 1);
			
			//map.put("type", this.fenBiInfoDto.getDir());
			//map.put("data", this.fenBiInfoDto.getData());	//fx 数据
			map.put("data", objs[0]);//调试用
			map.put("type", objs[1]);//调试用
		}

		System.out.println("time : " + time + " dto.getDir() : " + this.fenBiInfoDto.getDir());		
		String jsonStr = this.obj2Json(map);
		return result(callback, jsonStr);
	}
	
	/**
	 * 获取Brk & Dev : db
	 */
	@RequestMapping(value = "/getBrkDevInfo_db", method = {RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public String getBrkDevInfo_db(int period, long bin, long end, HttpServletRequest request) {
		String callback = request.getParameter("callback");
		Map<String, Object> map = new HashMap<String, Object>();
		List<BrkDevInfoDto> list = Data.getDataControl.getBrkDevInfo(period, bin, end);
		map.put("title", WebDataUtil.title_devBrk);
		map.put("data", WebDataUtil.getSingleInstance().getBrkDevInfoData(list));
		String jsonStr = this.obj2Json(map);
		return result(callback, jsonStr);
	}
	
	/**
	 * 获取Brk & Dev : me 依赖于 /loadFxByTime
	 */
	@RequestMapping(value = "/getBrkDevInfo_me", method = {RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public String getBrkDevInfo_me(int period, long bin, long end, HttpServletRequest request) {
		String callback = request.getParameter("callback");
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("title", WebDataUtil.title_devBrk);
		
		this.dto_k_01 = Data.pageManager.getCandlesDtoByTime(period, end);
		
		this.fm_dto = Data.conditionFxManager.getFmDtoByPeriod(period);
		
		this.dto_dvt =  Data.beiLiManager_Me.getBeiliDtoByPeriod(period, this.dto_k_01.getTime(), this.dto_k_01, this.fm_dto);
		this.breakDto = Data.breakManager.checkBreak_30(this.dto_k_01, this.fm_dto.getF_dto());
		if((null!= this.fm_dto && this.dto_dvt.isBeili()) || (null != this.breakDto && this.breakDto.isBreak())){
			
			List<BrkDevInfoDto> list =  WebDataUtil.getSingleInstance().getBrkDevInfoList(period, this.dto_dvt, this.breakDto);
			
			map.put("data", WebDataUtil.getSingleInstance().getBrkDevInfoData(list));
			String jsonStr = this.obj2Json(map);
			return result(callback, jsonStr);
		}

		map.put("data", "null");
		String jsonStr = this.obj2Json(map);
		return result(callback, jsonStr);
	}

}
