package test.thread.threadLocal.ThreadPoolExecutor;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " Thread 正在执行。。。");
    }
}

class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " Runnable 正在执行。。。");
    }
}

public class TestNewSingleThreadExecutor {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newSingleThreadExecutor();
        Thread t1 = new MyThread();
        Thread t2 = new MyThread();
        MyRunnable r1 = new MyRunnable();
        MyRunnable r2 = new MyRunnable();

        // 永远只有一个线程在执行，无论传入的是Thread还是Runnable，并且保证线程死后自动创建一个新的继续执行任务
        pool.execute(t1);//传线程对象是不科学的做法
        pool.execute(t2);//传线程对象是不科学的做法
        pool.execute(r1);//ok
        pool.execute(r2);//ok

        pool.shutdown();
    }
}
