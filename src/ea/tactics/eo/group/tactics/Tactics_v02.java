package ea.tactics.eo.group.tactics;

import java.util.ArrayList;

import ea.server.Controller;
import ea.service.utils.base.Mark;
import ea.tactics.eo.group.help.TecticsExeServer;
import ea.tactics.eo.group.main.Main_v02;

public class Tactics_v02 extends TecticsExeServer{
	
	public Tactics_v02(){
		super.setVersion(Mark.Version_v02);
	}
	
	@Override
	final public void buy(ArrayList<Integer> list) {
		if(!list.isEmpty() && Controller.isUp02){
			Main_v02.getSingleInstance().buyTacticsOne(list);
		}
	}

	@Override
	final public void sell(ArrayList<Integer> list) {
		if(!list.isEmpty() && Controller.isDn02){
			Main_v02.getSingleInstance().sellTacticsOne(list);
		}
	}
}
