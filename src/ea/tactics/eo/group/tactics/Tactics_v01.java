package ea.tactics.eo.group.tactics;

import java.util.ArrayList;

import ea.server.Controller;
import ea.service.utils.base.Mark;
import ea.tactics.eo.group.help.TecticsExeServer;
import ea.tactics.eo.group.main.Main_v01;

public class Tactics_v01 extends TecticsExeServer{

	public Tactics_v01(){
		super.setVersion(Mark.Version_v01);
	}
	
	@Override
	final public void buy(ArrayList<Integer> list) {
		if(!list.isEmpty() && Controller.isUp01){
			Main_v01.getSingleInstance().buyTacticsOne(list);
		}
	}

	@Override
	final public void sell(ArrayList<Integer> list) {
		if(!list.isEmpty() && Controller.isDn01){
			Main_v01.getSingleInstance().sellTacticsOne(list);
		}
	}
}
