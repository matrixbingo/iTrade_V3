package test.thread.threadLocal.ThreadPoolExecutor;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class MyRunnable01 implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " Runnable 正在执行。。。");
    }
}

public class TestNewCachedThreadPool {
    public static void main(String[] args) {
        // 创建一个可重用固定线程数的线程池
        ExecutorService pool = Executors.newCachedThreadPool();
        // 将线程放入池中进行执行
        pool.execute(new MyRunnable01());
        pool.execute(new MyRunnable01());
        pool.execute(new MyRunnable01());
        pool.execute(new MyRunnable01());
        pool.execute(new MyRunnable01());
        // 关闭线程池
        pool.shutdown();
    }
}