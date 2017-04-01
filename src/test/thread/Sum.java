package test.thread;

import java.util.Random;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.Future;

public class Sum {


    public static void main(String[] args) throws Exception {

        int[] arr = new int[1100];
        Random rand = new Random();
        int total = 0;
        //初始化100个数字
        for (int i = 0; i < arr.length; i++) {
            int tmp = rand.nextInt(20);
            //对元素赋值，并将数组元素的值添加到total总和中
            total += (arr[i] = tmp);
        }

        System.out.println("正确的total:" + total);
        ForkJoinPool pool = new ForkJoinPool();
        //提交可分解的CalTask任务
        Future<Integer> future = pool.submit(new CalTask(arr, 0, arr.length));
        System.out.println("qq :" + future.get());
        //关闭线程池

        pool.shutdown();
    }

}