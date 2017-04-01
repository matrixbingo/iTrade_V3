package ea.server.report;

import java.util.List;

import ea.server.Controller;
import ea.server.Data;
import ea.service.res.dto.BaseDto;
import ea.service.res.dto.MonIncDto;

public class Report {
	
	final public String getIncome(){
		List<BaseDto> list = Data.getDataControl.showOrderMonth(Controller.YEAR);
		MonIncDto dto = this.getMonth(list, 23341);
		System.out.println(dto.getTimes());
		return dto.getMonInc(list.size());
	}
	
	final private MonIncDto getMonth(List<BaseDto> list, int lastSum){
		MonIncDto dto = new MonIncDto(Controller.YEAR);
		if(null == list){
			return dto;
		}
		int total = lastSum;
		for(int i = 1; i <= list.size(); i++){
			total += list.get(i-1).getSum();
			switch(i){
				case 1 	: dto.setM01(total); break;
				case 2 	: dto.setM02(total); break;
				case 3 	: dto.setM03(total); break;
				case 4 	: dto.setM04(total); break;
				case 5 	: dto.setM05(total); break;
				case 6 	: dto.setM06(total); break;
				case 7 	: dto.setM07(total); break;
				case 8 	: dto.setM08(total); break;
				case 9 	: dto.setM09(total); break;
				case 10 : dto.setM10(total); break;
				case 11 : dto.setM11(total); break;
				case 12 : dto.setM12(total); break;
			}
		}
		return dto;
	}
	
	public static void main(String[] args) {
		System.out.println(new Report().getIncome());
	}
}
