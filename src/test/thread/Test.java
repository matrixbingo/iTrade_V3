package test.thread;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.concurrent.TimeUnit;

/**
 * 测试打印
 */
public class Test {


    public static void main(String[] args) throws Exception {
        ForkJoinPool pool = new ForkJoinPool();
        //提交可分解的任务
        pool.submit(new PrintTask(0, 101));

        //阻塞等待所有任务完成
        pool.awaitTermination(2, TimeUnit.SECONDS);
        pool.shutdown();//关闭线程池

    }
}