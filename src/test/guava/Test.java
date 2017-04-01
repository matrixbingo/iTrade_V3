package test.guava;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.common.base.CharMatcher;
import com.google.common.base.Charsets;
import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.base.Preconditions;
import com.google.common.base.Splitter;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Lists;
import com.google.common.collect.MapDifference;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multimaps;
import com.google.common.collect.Ordering;
import com.google.common.collect.Sets;
import com.google.common.collect.Sets.SetView;
import com.google.common.io.Files;
import com.google.common.primitives.Doubles;
import com.google.common.primitives.Ints;

import static com.google.common.base.Predicates.*;
import static com.google.common.collect.Iterables.*;

class Man {
    private String firstName;
    private String lastName;

    public Man(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}

public class Test {

    private String title;
    private Date date;
    private String author;

    public static void main(String[] args) {
        // 普通Collection的创建
        List<String> list = Lists.newArrayList();
        Set<String> set = Sets.newHashSet();
        Map<String, String> map = Maps.newHashMap();

        // 不变Collection的创建
        ImmutableList<String> iList = ImmutableList.of("a", "b", "c");
        ImmutableSet<String> iSet = ImmutableSet.of("e1", "e2");
        ImmutableMap<String, String> iMap = ImmutableMap.of("k1", "v1", "k2", "v2");

        // 文件读取演示
        /*File file = new File("/home/alexis/tests/text1");
        List<String> content = null;
        try {
            content = Files.readLines(file, Charsets.UTF_8);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        for (String line : content) {
            System.out.println(line);
        }*/

        // 基本类型操作
        int[] arr = {1, 2, 3};
        int[] arr2 = {1, 2, 3};
        int intCmp = Ints.compare(1, 2);
        int doubleCmp = Doubles.compare(1.1, 1.2);
        int index = Ints.indexOf(arr, 1);
        boolean contains = Ints.contains(arr, 1);
        int max = Ints.max(arr);
        int min = Ints.min(arr);
        int[] arr3 = Ints.concat(arr, arr2);

        // List转数组
        List<Integer> intList = Lists.newArrayList(1, 2, 3);
        int[] intArr = Ints.toArray(intList);

        // 便利字符匹配类 CharMatcher
        // 判断匹配结果
        boolean result = CharMatcher.inRange('a', 'z').or(CharMatcher.inRange('A', 'Z')).matches('K');
        // 保留数字文本
        String s1 = CharMatcher.DIGIT.retainFrom("abc 123 efg");
        // 删除数字文本
        String s2 = CharMatcher.DIGIT.removeFrom("abc 123 efg");
        // 更多方法参见 http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/base/CharMatcher.html

        // Joiner 与 Splitter
        // 使用 "/" 串联字符串
        String[] subdirs = {"usr", "local", "lib"};
        String path = Joiner.on("/").join(subdirs);
        System.out.println(path);

        // 使用 "," 切分字符串并去除空串与空格
        String s = "dog ,,, cat,fish,";
        Iterable<String> i = Splitter.on(',').omitEmptyStrings().trimResults().split(s);
        for (String ss : i) {
            System.out.println(ss);
        }

        // 集合过滤器
        // 使用自定义回调方法对Map的每个Value进行操作
        ImmutableMap<String, Double> m = ImmutableMap.of("a", 1.1, "b", 1.2);
        // Function<F, T> F表示apply()方法input的类型，T表示apply()方法返回类型
        Map<String, Double> m2 = Maps.transformValues(m, new Function<Double, Double>() {
            double e = 1.2;

            @Override
            public Double apply(Double input) {
                return input * e;
            }
        });
        System.out.println(m2);

        // 条件过滤集合
        // 方法来自 com.google.common.collect.Iterables 以及 com.google.common.base.Predicates
        ImmutableList<String> names = ImmutableList.of("Aleksander", "Jaran", "Integrasco", "Guava", "Java");
        Iterable<String> fitered = filter(names, or(equalTo("Aleksander"), equalTo("Jaran")));
        System.out.println(fitered);

        // 对计划排序，并生成排序后的集合拷贝视图
        Man man1 = new Man("Alexis", "Drazen");
        Man man2 = new Man("Bob", "Lee");
        Man man3 = new Man("Vince", "Carter");
        ImmutableList<Man> men = ImmutableList.of(man1, man2, man3);

        Comparator<Man> byLastName = new Comparator<Man>() {
            public int compare(final Man p1, final Man p2) {
                return p1.getLastName().compareTo(p2.getLastName());
            }
        };

        Comparator<Man> byFirstName = new Comparator<Man>() {
            public int compare(final Man p1, final Man p2) {
                return p1.getFirstName().compareTo(p2.getFirstName());
            }
        };

        // 先按 lastName 再按 firstName 排序，最后倒序
        List<Man> sortedCopy = Ordering.from(byLastName).compound(byFirstName).reverse().sortedCopy(men);
        System.out.println(sortedCopy);



        // Map 的更多操作
        Map<String, String> mapA = ImmutableMap.of("k1", "v1", "k2", "v2", "k3", "v3");
        Map<String, String> mapB = ImmutableMap.of("k2", "v2", "k3", "v3", "k4", "v4");
        MapDifference<String, String> differenceMap = Maps.difference(mapA, mapB);
        differenceMap.areEqual();
        Map entriesDiffering = differenceMap.entriesDiffering();
        Map entriesOnlyOnLeft = differenceMap.entriesOnlyOnLeft();
        Map entriesOnlyOnRight = differenceMap.entriesOnlyOnRight();
        Map entriesInCommon = differenceMap.entriesInCommon();
        System.out.println("Map 的更多操作");
        System.out.println(entriesDiffering);
        System.out.println(entriesOnlyOnLeft);
        System.out.println(entriesOnlyOnRight);
        System.out.println(entriesInCommon);

        // 使用Preconditions进行校验，校验不通过会抛出相应的异常
        //Test t = new Test("Tite", new Date(), "Author");


        // 集合的合集，交集，差集
        HashSet<Integer> setA = Sets.newHashSet(1, 2, 3, 4, 5);
        HashSet<Integer> setB = Sets.newHashSet(4, 5, 6, 7, 8);

        SetView<Integer> union = Sets.union(setA, setB);
        System.out.println("union:");
        for (Integer integer : union) {
            System.out.print(integer);
        }

        System.out.println("");
        SetView<Integer> difference = Sets.difference(setA, setB);
        System.out.println("difference:");
        for (Integer integer : difference) {
            System.out.print(integer);
        }

        System.out.println("");
        SetView<Integer> difference1 = Sets.difference(setB, setA);
        System.out.println("difference:");
        for (Integer integer : difference1) {
            System.out.print(integer);
        }

        System.out.println("");
        SetView<Integer> intersection = Sets.intersection(setA, setB);
        System.out.println("intersection:");
        for (Integer integer : intersection)
            System.out.println(integer);

    }

    // Multimap的使用，Multimap<T1, T2>,T1表示Map的键，T2表示Value集合的集合元素类型
    Map<String, List<Man>> map = new HashMap<String, List<Man>>();

    public void addMan1(String author, Man Man) {
        List<Man> Mans = map.get(author);
        if (Mans == null) {
            Mans = new ArrayList<Man>();
            map.put(author, Mans);
        }
        Mans.add(Man);
    }

    // 使用Multimap替代以上代码
    Multimap<String, Man> multimap = ArrayListMultimap.create();

    public void addMan2(String name, Man man) {
        multimap.put(name, man);
    }

    // Multimap的高级应用
    // listOfMaps代表一个List中包含多个这种 mapOf("type", "blog", "id", "292", "author", "john"); 类型的Map
    // 现在需要根据type将这些map放在不同的list中
    List listOfMaps = null; // 这里省略 listOfMaps 的初始化
    Multimap<String, Map<String, String>> partitionedMap = Multimaps.index(
            listOfMaps,
            new Function<Map<String, String>, String>() {
                public String apply(final Map<String, String> from) {
                    return from.get("type");
                }
            });




    // 使用Preconditions进行校验
    public Test(String title, Date date, String author) {
        /*this.title = Preconditions.checkNotNull(title);
        this.date = Preconditions.checkNotNull(date);
        this.author = Preconditions.checkNotNull(author);*/


    }


}