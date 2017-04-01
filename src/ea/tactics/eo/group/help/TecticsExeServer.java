package ea.tactics.eo.group.help;

import java.util.ArrayList;

import ea.service.res.dto.InListDto;
import ea.service.utils.base.Mark;
import ea.tactics.eo.control.in.TecticsInterface;

public abstract class TecticsExeServer implements TecticsInterface{
	protected int version;
	public void exe(InListDto dto) {
		switch(dto.getDir()){
			case Mark.Action_Type_Buy : this.buy(dto.getList());
				break;
			case Mark.Action_Type_Sell: this.sell(dto.getList());
				break;
		}
	}
	
	protected abstract void buy(ArrayList<Integer> list);
	
	protected abstract void sell(ArrayList<Integer> list);

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}
}
