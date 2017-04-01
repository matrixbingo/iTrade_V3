package ea.service.res.dto;

import java.util.ArrayList;

import ea.service.utils.base.Mark;

public class InListDto {
	private int version;
	private int dir;
	private ArrayList<Integer> list = null;
	private int type = Mark.OutMarket_No;	//无状态无操作
	
	public InListDto(int version, int dir, ArrayList<Integer> list){
		this.version  = version;
		this.dir  	  = dir;
		this.list     = list;
	}
	
	public InListDto(int version, int dir, ArrayList<Integer> list, int type){
		this.version  = version;
		this.dir  	  = dir;
		this.list     = list;
		this.type	  = type;
	}
	
	final public int getVersion() {
		return this.version;
	}
	final public void setVersion(int version) {
		this.version = version;
	}
	final public int getDir() {
		return this.dir;
	}
	final public void setDir(int dir) {
		this.dir = dir;
	}
	final public ArrayList<Integer> getList() {
		return this.list;
	}
	final public void setList(ArrayList<Integer> list) {
		this.list = list;
	}
	final public int getType() {
		return type;
	}
	final public void setType(int type) {
		this.type = type;
	}
}
