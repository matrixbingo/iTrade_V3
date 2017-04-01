package test;

import test.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import ea.service.res.dto.BaseDto;
import org.apache.commons.lang3.time.DateUtils;

public class ListRemove {
    private List<BaseDto> getBaseDtos() {
        List<BaseDto> BaseDtos = new ArrayList<BaseDto>() {
            {
                int i = 0;
                while (i++ < 10) {
                    BaseDto dto = new BaseDto();
                    dto.setNum(i);
                    //dto.setStr("name_" + i);
                    this.add(dto);
                }
            }
        };

        return BaseDtos;
    }

    public void iteratorRemove() {
        List<BaseDto> BaseDtos = this.getBaseDtos();
        System.out.println(BaseDtos);


        Iterator<BaseDto> stuIter = BaseDtos.iterator();
        while (stuIter.hasNext()) {
            BaseDto dto = stuIter.next();
            System.out.println("1 -- " + dto.getNum());
            if (dto.getNum() % 2 == 0)
                stuIter.remove();//这里要使用Iterator的remove方法移除当前对象，如果使用List的remove方法，则同样会出现ConcurrentModificationException
        }
        Iterator<BaseDto> it = BaseDtos.iterator();
        while (it.hasNext()) {
            BaseDto dto = it.next();


            System.out.println("2 -- " + dto.getNum());
        }
    }

    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<Integer>();
        list.add(1);
        list.add(2);
        /*ListRemove lr = new ListRemove();
        lr.iteratorRemove();
*/
    }

}
