package test;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

public class MapRemove {
	public static void main(String[] args){      
        HashMap<String, Integer> hs=new HashMap();    
        hs.put("p1", 1);
        hs.put("p2", 2);
        hs.put("p3", 3);
        hs.put("p4", 4);
        hs.put("p5", 5);
        hs.put("p6", 6);       
        Iterator<Entry<String, Integer>> it= hs.entrySet().iterator();  
        while(it.hasNext()){
        	Map.Entry<String, Integer> entry = (Map.Entry) it.next();
            if(entry.getValue() > 3){
            	it.remove();
            }
              
        }   
        
        it=hs.entrySet().iterator();
        while(it.hasNext()){
        	Map.Entry<String, Integer> entry = (Map.Entry) it.next();       
            System.out.println(entry.getKey());        
        } 
	}
	
	
}
