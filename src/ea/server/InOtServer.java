package ea.server;

import java.util.ArrayList;

import ea.service.res.dto.InListDto;
import ea.service.utils.base.Mark;

@SuppressWarnings("unused")
public class InOtServer {
	private static InOtServer singleInstance = null;
	private ArrayList<InListDto> ilist_up_05 = new ArrayList<InListDto>(), ilist_dn_05 = new ArrayList<InListDto>(), ilist_up_10 = new ArrayList<InListDto>(), ilist_dn_10 = new ArrayList<InListDto>();
	private ArrayList<InListDto> olist_up_05 = new ArrayList<InListDto>(), olist_dn_05 = new ArrayList<InListDto>();
	private ArrayList<Integer> list = new ArrayList<Integer>();
	public static InOtServer getSingleInstance(){
		if (singleInstance == null) {
			synchronized (InOtServer.class) {
				if (singleInstance == null) {
					singleInstance = new InOtServer();
				}
			}
		}
		return singleInstance;
	}
	
	private InOtServer(){
		
		

	}
	//-- in market by dvt
	private void inMark_Dvt(){
		this.list.clear();
		this.addlist(Mark.Order_Dir_v01, Mark.Order_Dir_v02, Mark.Order_Dir_v03);	//dvt
		this.addlist(Mark.Order_Dir_v04, Mark.Order_Dir_v05, Mark.Order_Dir_v06);	//brk
		this.ilist_dn_05.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, this.list));  // 空
		this.ilist_dn_10.add(new InListDto(Mark.Version_v01, Mark.Action_Type_Sell, this.list));
	}
	
	final private void addlist(int ...ints){
		for(int i : ints){
			this.list.add(i);
		}
    }
}
