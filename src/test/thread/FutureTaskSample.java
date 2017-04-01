package test.thread;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

/**
 * <p>Test</p>
 * <p>Description:</P>
 * <p>Company:</p>
 * <p>Department:CAS</p>
 *
 * @Author: Tommy Zhou
 * @Since: 1.0
 * @Version:Date:2011-4-26
 */
public class FutureTaskSample {

    static FutureTask<String> future = new FutureTask(new Callable<String>() {
        public String call() {
            return getPageContent();
        }
    });


    public static String doOwnThing() {
        return "Do Own Thing";
    }

    public static String getPageContent() {
        return "testPageContent and provide that the operation is a time exhausted thing...";
    }

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        //Start a thread to let this thread to do the time exhausting thing
        new Thread(future).start();
        //Main thread can do own required thing first
        doOwnThing();
        //At the needed time, main thread can get the result
        System.out.println(future.get());
    }
}