package test;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by tomjack on 16/4/13.
 */
public class TestBreak {
    class Dto{

        private int a = 0;

        public Dto(int a){
            this.a = a;
        }

        public int getA() {
            return a;
        }

        public void setA(int a) {
            this.a = a;
        }
    }
    public static void main(String[] args) {

        List<Map> list = new ArrayList<Map>();
        Map<Integer, Integer> map = new HashMap<Integer, Integer>();
        map.put(1, 1);
        map.put(2, 2);
        map.put(3, 3);
        list.add(map);


        Map<Integer, Integer> map1 = new HashMap<Integer, Integer>();
        map1.put(1, 1);
        map1.put(2, 2);
        list.add(map1);


        Map<Integer, Integer> map2 = new HashMap<Integer, Integer>();
        map2.put(1, 1);
        map2.put(4, 4);
        map2.put(5, 5);
        map2.put(6, 6);
        map2.put(7, 7);
        list.add(map2);


        for(Map _map : list){
            Iterator it = _map.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry entry = (Map.Entry) it.next();
                Integer  i = (Integer) entry.getValue();
                System.out.println("aa ---> " + entry.getValue());
                if (i == 2) {
                    System.out.println(entry.getValue());
                    break;
                }
            }
        }

    }
}
