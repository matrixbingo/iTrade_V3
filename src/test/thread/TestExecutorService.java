package test.thread;

import java.util.concurrent.*;

/**
 * Created by tomjack on 15/5/13.
 */
public class TestExecutorService {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        FutureTask<String> futureTask =
                new FutureTask<String>(new Callable<String>() {
                    public String call() {
                        //真正的任务，这里的返回值类型为String，可以为任意类型
                        return testResult(1);
                    }
                });
        executor.execute(futureTask);
        //在这里可以做别的任何事情
        String result = null;
        try {
            //取得结果，同时设置超时执行时间为0.1秒。同样可以用future.get()，不设置执行超时时间取得结果
            result = futureTask.get();

        } catch (InterruptedException e) {
            futureTask.cancel(true);
        } catch (ExecutionException e) {
            futureTask.cancel(true);
          //超时后，进行相应处理
        } finally {
            executor.shutdown();
        }
        System.out.println("result=" + result);
    }

    private static String testResult(int num) {
        System.out.println("begin");

            return "12333";

    }
}
