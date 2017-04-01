package test;

import java.util.ArrayList;
import java.util.List;


import ea.server.Common;
import ea.service.res.dto.BaseDto;
import ea.service.utils.comm.TimeStamp;

public class TestNewObj {
	
	final private List<BaseDto> getBaseDtos(final int num) {  
        List<BaseDto> BaseDtos = new ArrayList<BaseDto>() {
            {  
                int i = 0;
                BaseDto dto = null;
                while (i++ < num) {  
                    dto = new BaseDto();
                	dto.setNum(i);
                	//dto.setStr("name_" + i);
                    this.add(dto);  
                }  
            }  
        };  
        return BaseDtos;  
    }
	
	public static void main(String[] args) {
		TestNewObj to = new TestNewObj();
		TimeStamp t = TimeStamp.getSingleInstance();
		to.getBaseDtos(10000000);
		String runtime = t.stop();
		System.out.println("程序运行时间： " + runtime);
	}

}
