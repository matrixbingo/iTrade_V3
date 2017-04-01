package ea.service.utils.var.control;

import ea.service.utils.base.ApplicationPath;
import ea.service.utils.var.server.manager.VarPropManager;

public class PropControl {
	private static final String varPropUrl =  ApplicationPath.vars_url + "var.properties";
	
	public static VarPropManager varProp = VarPropManager.getSingleInstance(varPropUrl, false);
	
}
