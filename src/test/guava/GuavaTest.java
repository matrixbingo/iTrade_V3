package test.guava;

import com.google.common.base.*;

import java.util.*;

/**
 * Created by tomjack on 15/5/11.
 */
public class GuavaTest {

   public static void main(String[] args){
       //1 - 链接操作
       List<String> list = new ArrayList<String>() {
           {
               add("aa");
               add("bb");
               add("cc");
           }
       };

       String[] langs = new String[]{"aa", "bb", "cc"};
       String delimter = ",";
       // Joiner类一旦创建则不可变，满足不可变性，因此线程安全

       Joiner joiner = Joiner.on("-");
       String rs = joiner.join(list);
       System.out.println("rs : " + rs);

       // 将null替代为empty字符串
       String replaceNullString = joiner.useForNull("empty").join(langs);


       System.out.println("replaceNullString: " + replaceNullString);

       // 不对null处理，默认会抛NullPointerException
       String defaultNullString = joiner.join(langs); //langs为List<String>
       System.out.println("defaultNullString: " + defaultNullString);


       StringBuilder stringBuilder = new StringBuilder();
       joiner = Joiner.on(",").skipNulls();
       joiner.appendTo(stringBuilder, "1", "2", "1", "2", "1", "2", "1", "2");
       System.out.println(stringBuilder.toString()); //appendTo,StringBuilder


       Map<String, String> map = new HashMap<String, String>(){{
           put("key1", "value1");
           put("key2", "value2");
           put("key3", "value3");
           put("key4", "4");
       }};


       Joiner.MapJoiner mapJoiner = Joiner.on(",").withKeyValueSeparator("=");
       String str = mapJoiner.join(map);
       System.out.println(str);

       //-2 分割操作
       str = "try ,do , your , best";
       Splitter splitter = Splitter.on(",").trimResults(); //用逗号分割且去掉每个字符串周围的空格
       //splitter.trimResults(); //这样是不会去掉各个元素空格的, 它仅返回一个新的Splitter
       Iterable<String> res = splitter.split(str);
       System.out.println(res);

       System.out.println(Strings.padEnd("a", 10, 'b'));

       Map<String, State> states = new HashMap<String, State>(){{
           put("abc", new State());
       }};
       Function<String, State> lookup = Functions.forMap(states);
       System.out.println(lookup.apply("abc"));//key不存在会抛异常


       Joiner.MapJoiner JOINER = Joiner.on(", ").withKeyValueSeparator("=").useForNull("");
       System.out.println(JOINER.join(map));
   }


}


class State {
    private String name;
    private String code;
    private Set<String> mainCities = new HashSet<String>();
}

