package test.thread.threadLocal.locks;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Test {

    public static void main(String[] args) {
        Lock lock = new ReentrantLock();

        Consumer consumer = new Consumer(lock);
        Producer producer = new Producer(lock);

        new Thread(consumer).start();
        new Thread(producer).start();
    }
}