package test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import ea.server.Data;
import ea.service.utils.base.Mark;
 
class CandlesDto {
    private final Integer code;
     
    public CandlesDto(Integer code){
        this.code = code;
    }
     
    public Integer getCno() {
        return code;
    }
}


public class CommonTest {
	
	public static void sort(List<CandlesDto> list){
		 Collections.sort(list, new Comparator<CandlesDto>(){
	            @Override
	            final public int compare(CandlesDto o1, CandlesDto o2) {
	                int i = (int)o1.getCno();
	                int j = (int)o2.getCno();
	                if(i > j)
	                    return 1;	//正序 return 1
	                else if(i <= j)
	                    return -1;	//正序 return -1
	                return 0;
	            }
	        });
	}
    @SuppressWarnings("unchecked")
    public static void main(String[] args){
        List<CandlesDto> list = new ArrayList<CandlesDto>();
        
        list.add(new CandlesDto(10));
        list.add(new CandlesDto(1));
        list.add(new CandlesDto(5));
         
/*        sort(list);
         
        for(CandlesDto e : list){
            System.out.println(e.getCno());
        }*/
        ea.service.res.dto.CandlesDto dto = null;
        dto = Data.pageManager.getCandlesDtoByTime(Mark.Period_M05, 20110102230500L);
        dto = Data.pageManager.getCandlesDtoByTime(Mark.Period_M05, 20110102231000L);
        dto = Data.pageManager.getCandlesDtoByTime(Mark.Period_M05, 20110102231500L);
        dto = Data.pageManager.getCandlesDtoByTime(Mark.Period_M05, 20110102232000L);
    }    
}