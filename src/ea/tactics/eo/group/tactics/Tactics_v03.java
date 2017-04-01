package ea.tactics.eo.group.tactics;

import java.util.ArrayList;

import ea.server.Controller;
import ea.service.utils.base.Mark;
import ea.tactics.eo.group.help.TecticsExeServer;
import ea.tactics.eo.group.main.Main_v03;

public class Tactics_v03 extends TecticsExeServer{

	public Tactics_v03(){
		super.setVersion(Mark.Version_v03);
	}
	
	@Override
	public void buy(ArrayList<Integer> list) {
		if(!list.isEmpty() && Controller.isUp03){
			Main_v03.getSingleInstance().buyTacticsOne(list);
		}
	}

	@Override
	public void sell(ArrayList<Integer> list) {
		if(!list.isEmpty() && Controller.isDn03){
			Main_v03.getSingleInstance().sellTacticsOne(list);
		}
	}
}
