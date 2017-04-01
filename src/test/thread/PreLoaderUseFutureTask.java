package test.thread;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

/**
 * 使用FutureTask来提前加载稍后要用到的数据
 *
 * @author zhy
 */
public class PreLoaderUseFutureTask {
    /**
     * 创建一个FutureTask用来加载资源
     */
    private final FutureTask<String> futureTask = new FutureTask<String>(
            new Callable<String>() {
                @Override
                public String call() throws Exception {
                    Thread.sleep(3000);
                    return "加载资源需要3秒";
                }
            });

    public final Thread thread = new Thread(futureTask);

    public void start() {
        thread.start();
    }

    /**
     * 获取资源
     *
     * @return
     * @throws ExecutionException
     * @throws InterruptedException
     */
    public String getRes() throws InterruptedException, ExecutionException {
        return futureTask.get();//加载完毕直接返回，否则等待加载完毕

    }

    public static void main(String[] args) throws InterruptedException, ExecutionException {

        PreLoaderUseFutureTask task = new PreLoaderUseFutureTask();
        /**
         * 开启预加载资源
         */
        task.start();
        // 用户在真正需要加载资源前进行了其他操作了2秒
        Thread.sleep(2000);

        /**
         * 获取资源
         */
        System.out.println(System.currentTimeMillis() + "：开始加载资源");
        String res = task.getRes();
        System.out.println(res);
        System.out.println(System.currentTimeMillis() + "：加载资源结束");
    }

}