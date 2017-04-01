package test.thread;

import ea.service.res.dto.PageDto;
import org.apache.commons.collections.bag.SynchronizedSortedBag;
import org.apache.commons.lang.StringUtils;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;


/**
 * 使用FutureTask模拟预加载下一页图书的内容
 *
 * @author zhy
 */
public class BookInstance {

    /**
     * 当前的页码
     */
    private volatile int currentPage = 1;



    /**
     * 异步的任务获取当前页的内容
     */
    FutureTask<String> futureTask = new FutureTask<String>(
            new Callable<String>() {
                @Override
                public String call() throws Exception {
                    return loadDataFromNet();
                }
            });

    /**
     * 实例化一本书，并传入当前读到的页码
     *
     * @param currentPage
     */
    public BookInstance(int currentPage) {
        this.currentPage = currentPage;
        /**
         * 直接启动线程获取当前页码内容
         */
        Thread thread = new Thread(futureTask);
        thread.start();
    }

    /**
     * 获取当前页的内容
     *
     * @return
     * @throws InterruptedException
     * @throws ExecutionException
     */
    public String getCurrentPageContent() throws InterruptedException,
            ExecutionException {
        String con = futureTask.get();
        this.currentPage = currentPage + 1;
        Thread thread = new Thread(futureTask = new FutureTask<String>(
                new Callable<String>() {
                    @Override
                    public String call() throws Exception {
                        return loadDataFromNet();
                    }
                }));
        thread.start();
        return con;
    }

    /**
     * 根据页码从网络抓取数据
     *
     * @return
     * @throws InterruptedException
     */
    private String loadDataFromNet() throws InterruptedException {
        Thread.sleep(1000);
        return "Page " + this.currentPage + " : the content ....";

    }

    public PageDto getPageDto(int period, int page) {
        System.out.println("new PageDto --");
        return new PageDto();
    }

    public static void main(String[] args) throws InterruptedException,
            ExecutionException {
        BookInstance instance = new BookInstance(1);
        for (int i = 0; i < 10; i++) {
            long start = System.currentTimeMillis();
            String content = instance.getCurrentPageContent();
            System.out.println("[1秒阅读时间]read:" + content);
            Thread.sleep(1000);
            System.out.println(System.currentTimeMillis() - start);
        }

    }
}