package ea.service.res.data.indicator;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import ea.server.Data;
import ea.service.res.dto.CandlesDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.Util;

/**
 * 计算KD指标
 * %K = (CLOSE-LOW(%K))/(HIGH(%K)-LOW(%K)) * 100
 * %d = SMA(%k,3) = (%k + %(k-1) + %(k-2))/3
 */
public class KD {
	private static KD singleInstance = null;
	
	private KDDto kdDto = new KDDto();
	private int KPeriod = 9;
	private int DPeriod = 3;
	private int Slowing = 3;

	private double k = 0 , d = 0;								//上一个%k
	private double[] LowesBuffer = new double[this.Slowing];	//周期内最小值
	private double[] HighsBuffer = new double[this.Slowing];	//周期内最大值
			
	private double[] KD = { 0 , 0 };
	
	private CandlesDto[] m_kData;
	private Queue<CandlesDto> s_kData = new LinkedList<CandlesDto>();
	private Queue<Double> s_Lowes = new LinkedList<Double>();
	private Queue<Double> s_Highs = new LinkedList<Double>();
	private Queue<Double> s_SMA = new LinkedList<Double>();

    public static KD getSingleInstance() {
        if (null == singleInstance) {
            synchronized (KD.class) {
                if (null == singleInstance) {
                    singleInstance = new KD();
                }
            }
        }
        return singleInstance;
    }
    final private void clearAll(){
    	this.s_kData.clear();
    	this.s_Lowes.clear();
    	this.s_Highs.clear();
    	this.s_SMA.clear();
    }
	/**
	 * 初始化数据
	 */
    final private void initM_kData() {
        this.m_kData = new CandlesDto[this.KPeriod];
        int i = 0;
        Iterator<CandlesDto> it = this.s_kData.iterator();
        while (it.hasNext()) {
        	CandlesDto dto = it.next();
        	this.m_kData[i] = dto;
        	i++;
        }
    }
    final private void initMaxMin(double min, double max){
        this.s_Lowes.add(min);
    	if(this.s_Lowes.size() > this.Slowing){
    		this.s_Lowes.remove();
    	}
    	int i = 0;
        Iterator<Double> it = this.s_Lowes.iterator();
        while (it.hasNext()) {
        	double low = it.next();
        	this.LowesBuffer[i] = low;
        	i++;
        }
    	
    	this.s_Highs.add(max);
    	if(this.s_Highs.size() > this.Slowing){
    		this.s_Highs.remove();
    	}
    	i = 0;
        it = this.s_Highs.iterator();
        while (it.hasNext()) {
        	double high = it.next();
        	this.HighsBuffer[i] = high;
        	i++;
        }
    }
    final private double getAvgSma(double k){
    	this.s_SMA.add(k);
    	if(this.s_SMA.size() > this.DPeriod){
    		this.s_SMA.remove();
    	}
    	double sum = 0;
    	Iterator<Double> it = this.s_SMA.iterator();
        while (it.hasNext()) {
        	double s = it.next();
        	sum += s;
        }
        return sum/this.DPeriod;
    }
    
    final private double[] calculate(int cno){    	
    	double max = -1000 , sumMax = 0.0;
        double min = 10000 , sumMin = 0.0;
        for(int i = 0 ; i < this.KPeriod ; i++){
        	if(this.m_kData[i].getHigh() > max){
        		max = this.m_kData[i].getHigh();
        	}
        	if(this.m_kData[i].getLow() < min){
        		min = this.m_kData[i].getLow();
        	}
        }

        this.initMaxMin(min, max);
    	
        int a = this.KPeriod - 1;
        int i = this.Slowing - 1;
        while(i >= 0){
        	sumMin += this.m_kData[a].getClose() - this.LowesBuffer[i];
            sumMax += this.HighsBuffer[i] - this.LowesBuffer[i];
            i--;
            a--;
        }

    	if(cno > this.KPeriod + this.DPeriod){
	        this.k = sumMin/sumMax * 100;
	        this.d = this.getAvgSma(this.k);
	        this.KD[0] = Util.getRound(this.k, 5);
	        this.KD[1] = Util.getRound(this.d, 5);
    	}
    	return this.KD;
    }
	
    private KDDto getKdDto(KDDto kdDto, CandlesDto dto, int cno){
    	this.s_kData.add(dto);
        if (this.s_kData.size() >= this.KPeriod) {
        	
        	this.initM_kData();	
        	
        	double[] rs = this.calculate(cno);
        	kdDto.setK(rs[0]);
    		kdDto.setD(rs[1]);
    		
        	this.s_kData.remove();
        }
        return kdDto;
    }
    
    /**
	 * 非实时刷新
	 */
    final public KDDto creatKD(int period, int cno) {
    	CandlesDto dto = Data.pageManager.getCandlesDtoByCno(period, cno);
        if (null == dto) {
            return null;
        }
        
        this.kdDto.setCno(cno);
        this.kdDto.setTime(dto.getTime());
        this.kdDto.setPeriod(period);
    	if(cno < this.KPeriod || this.s_kData.size() < this.KPeriod){
    		this.kdDto.setK(this.KD[0]);
    		this.kdDto.setK(this.KD[1]);
    	}
        return this.getKdDto(this.kdDto, dto, cno);
    }
    
    /**
     * 实时刷新
     */
    final public void creatKD(int period) {
    
    	String tab = Util.getTabNameByPeriod(period);
    	int cno = Data.dBHandler.getCno(tab);
   
    	this.creatHisKD(period, cno);
    	
      	this.clearAll();
      	
    	int bin = cno - this.DPeriod -  this.KPeriod;
    	for(int i = bin;  i <= cno; i++){
    		this.kdDto = this.creatKD(period, i);
    	}

    	//System.out.println(kdDto.getCno() + " 2 |--> " + kdDto.getK() + " : " + kdDto.getD());

    	
    	Data.exeDataControl.addKD(this.kdDto);
    }
    
    /**
     * 实时刷新：初始化参数 s_kData
     */
    private void initCurr_s_kData(String tab, int cno){
    	String sql = "select * from " + tab + " where cno < " + (cno - 1) + " order by time desc limit " + this.KPeriod;
    	List<CandlesDto> list = Data.getDataControl.getCandlesBySql(sql);
    	
    	Util.sort(list);
    	
    	Iterator<CandlesDto> it = list.iterator();
    	while(it.hasNext()){
    		CandlesDto _dto = it.next();
    		this.s_kData.add(_dto);
    	}
    	
    	this.initM_kData();
    }
    
    /**
     * 实时刷新：初始化参数 MaxMin
     */
    private void initCurr_MaxMin(String tab, int cno){
    	String sql = "select * from " + tab + " where cno < " + cno + " order by time desc limit " + (this.KPeriod + this.DPeriod);
    	List<CandlesDto> list = Data.getDataControl.getCandlesBySql(sql);
    	
    	Util.sort(list);

    	Iterator<CandlesDto> it = list.iterator();
    	while(it.hasNext()){
    		CandlesDto _dto = it.next();
    		this.calculate(_dto.getCno());
    	}
    	
    	
    }
    
    /**
     * 实时刷新：初始化参数 MaxMin
     */
    private void initCurr_s_SMA(String tab, int cno){
    	String sql = "select k from t_kd where cno >= " + (cno - this.DPeriod) + " ORDER BY cno asc limit " + this.DPeriod;
    	List<CandlesDto> list = Data.getDataControl.getCandlesBySql(sql);
    	
    	Iterator<CandlesDto> it = list.iterator();
    	while(it.hasNext()){
    		CandlesDto _dto = it.next();
    		this.s_SMA.add(_dto.getK());
    	}
    }
    
    /**
     * 实时刷新：计算当前时间到上一次结束的KD
     */
    private void creatHisKD(int period, int cno){

    	HashMap<String, Object> map = Data.getDataControl.exeSqlToMap("select max(cno) cno from t_kd where period = " + period);
    	int end_kd = 1;
    	if(null != map && !map.isEmpty()){
    		end_kd = Integer.parseInt(map.get("cno").toString());
    	}
    	
		if(cno > end_kd){
			
	    	int bin = end_kd - this.DPeriod -  this.KPeriod;
	    	if(bin > 0){
	    		for(int i = bin;  i < end_kd; i++){
		    		this.kdDto = this.creatKD(period, i);
		    	}
	    	}
	    	
			for (int i = end_kd; i <= cno; i++) {
				
				this.kdDto = Data.kd.creatKD(period, i);
	        	Data.exeDataControl.addKD(this.kdDto);
	            //System.out.println(this.kdDto.getCno() + " 1 |--> " + this.kdDto.getK() + " : " + this.kdDto.getD());
	           
	        }
		}
    }
    
	public static void main(String[] args) {
//		for (int i = 1; i < 114; i++) {
//        	KDDto dto = Data.kd.creatKD(Mark.Period_M05, i);
//        	Data.exeDataControl.addKD(dto);
//            System.out.println(dto.getCno() + " |--> " + dto.getK() + " : " + dto.getD());
//        }
		Data.kd.creatKD(Mark.Period_M05);
	}

}
