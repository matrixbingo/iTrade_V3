package test.guava;

import com.google.common.base.Function;
import com.google.common.base.Functions;
import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

class Person {
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

interface Func<F, T> {

    T apply(F currentElement, T origin);

}

class Reduce {
    private Reduce() {

    }

    public static <F, T> T reduce(final Iterable<F> iterable, final Func<F, T> func, T origin) {

        for (Iterator iterator = iterable.iterator(); iterator.hasNext(); ) {
            origin = func.apply((F) (iterator.next()), origin);
        }

        return origin;
    }
}



public class FunctionTest {
    public static void main(String[] args){
        List<Person> peoples = Lists.newArrayList(new Person("bowen", 27),
                new Person("bob", 20),
                new Person("Katy", 18),
                new Person("Logon", 24));

        List<Person> oldPeople = Lists.newArrayList(Collections2.filter(peoples, new Predicate<Person>() {
            public boolean apply(Person person) {
                return person.getAge() >= 20;
            }
        }));

        List<String> names = Lists.newArrayList(Collections2.transform(peoples, new Function<Person, String>() {
            public String apply(Person person) {
                return person.getName();
            }
        }));

        Integer ages = Reduce.reduce(peoples, new Func<Person, Integer>() {
            public Integer apply(Person person, Integer origin) {
                return person.getAge() + origin;
            }
        }, 0);

        Integer maxAge = Reduce.reduce(peoples, new Func<Person, Integer>() {
            public Integer apply(Person person, Integer origin) {
                return person.getAge() > origin ? person.getAge() : origin;
            }
        }, 0);

        System.out.println(maxAge);

        new FunctionTest().testFunctions();
    }

    public void testFunctions() {
        Map<String, Integer> map = new HashMap<String, Integer>() {
            //构造一个测试用Map集合
            {
                put("love", 1);
                put("miss", 2);
            }
        };
        /**
         * forMap
         */
        Function<String, Integer> function = Functions.forMap(map);
        //调用apply方法，可以通过key获取相应的value
        System.out.println(function.apply("love"));//i love u

        //我们可以通过forMap重载的另一个方法避免异常，当Key不存在时，设置一个默认值
        function = Functions.forMap(map, 0);
        System.out.println(function.apply("like"));//can't find this key
        /**
         * 有时候，我们需要多个Function进行组合，
         * 这时就需要用到compose，如下：
         */
        //我们有一个Function用于将输入的数字进行平方运算
        Function<Integer, Integer> function1 = new Function<Integer, Integer>() {
            @Override
            public Integer apply(Integer input) {
                return input * input;
            }
        };
        //我们将上面Map中的value值全部进行平方运算
        /**
         * Warning：这里compose方法的参数位置不能颠倒，
         * Function<A, C> compose(Function<B, C> g, Function<A, ? extends B> f)
         * 传入Function<B,C>、Function<A, ? extends B>组合成Function<A, C>
         */
        Function<String, Integer> result = Functions.compose(function1, function);
        System.out.println(result.apply("love"));//I LOVE U
        //当Key值不存在时，结果也是大写的
        System.out.println(result.apply("like"));//CAN'T FIND THIS KEY
    }
}


