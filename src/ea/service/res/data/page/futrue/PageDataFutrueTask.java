package ea.service.res.data.page.futrue;

import ea.service.res.dto.PageDto;
import ea.service.utils.base.Mark;
import ea.service.utils.comm.TimeStamp;

import java.util.concurrent.*;

/**
 * 使用FutureTask预加载下一页数据
 */
public class PageDataFutrueTask {

    /**
     * 当前的页码
     */
    private volatile int currentPage = 1;

    private volatile int period = Mark.No_Period;

    private static PageDataFutrueTask singleInstance = null;

    private static ConcurrentHashMap<Integer, PageDataFutrueTask> instances = new ConcurrentHashMap<Integer, PageDataFutrueTask>();

    private ExecutorService executor = Executors.newSingleThreadExecutor();

    /**
     * 异步的任务获取当前页的内容
     */
    private FutureTask<PageDto> futureTask = new FutureTask<PageDto>(
            new Callable<PageDto>() {
                @Override
                public PageDto call() throws Exception {
                    return loadPageDtoFormDB();
                }
            });

    final public static PageDataFutrueTask getSingleInstance(Integer period, int page) {
        singleInstance = PageDataFutrueTask.instances.get(period);
        if (null != singleInstance) {
            return singleInstance;
        } else {
            singleInstance = new PageDataFutrueTask(period, page);
            instances.put(period, singleInstance);
        }
        return singleInstance;
    }

    /**
     * 直接启动线程获取当前页码内容
     */
    private PageDataFutrueTask(int period, int currentPage) {
        this.period = period;
        this.constract(currentPage);
    }

    private void constract(int currentPage) {
        this.currentPage = currentPage;
        this.exeThread();
    }


    /**
     * 获取当前页的内容
     */
    public PageDto getCurrentPageContent(int page) throws Exception{
        if (page == 0) {
            return new PageDto();
        }
        //如果不取下一页,撤销任务
        if (page != this.currentPage) {
            if (!futureTask.isDone()) {
                futureTask.cancel(true);
            }
            this.constract(page);
        }

        /*while (!futureTask.isDone()) {
            System.out.println("看完了没...");
            Thread.sleep(1);
            System.out.println(futureTask.isDone());
        }*/
        PageDto pdto = new PageDto();
        try{
            pdto = futureTask.get();
        }catch (Exception e){
            System.out.println("1111");
        }

        PageManagerNew.getSingleInstance().initCurrPageInfo(period, page, pdto);
        this.currentPage = currentPage + 1;
        this.exeThread();
        return pdto;
    }

    private void exeThread() {
        futureTask = new FutureTask<PageDto>(
                new Callable<PageDto>() {
                    @Override
                    public PageDto call() throws Exception {
                        return loadPageDtoFormDB();
                    }
                });
        executor.execute(futureTask);
    }

    /**
     * 任务接口
     */
    private PageDto loadPageDtoFormDB() throws InterruptedException {
        //System.out.println(1111);
        return FutrueData.getSingleInstance().loadPageDtoFormDB(this.period, this.currentPage);
        //return this.getPageDto(this.period, this.currentPage);
    }

    /**
     * 加载页数据
     * @param period
     * @param page
     * @return
     */
    private PageDto getPageDto(int period, int page) throws InterruptedException{
        Thread.sleep(2000);
        System.out.println("Page " + page + " : the content ....");
        return new PageDto();
    }


    public static void main(String[] args) throws Exception {

        TimeStamp t = TimeStamp.getSingleInstance();

        PageDataFutrueTask instance = PageDataFutrueTask.getSingleInstance(Mark.Period_M30, 1);
        //for (int i = 0; i < 10; i++) {
        //    long start = System.currentTimeMillis();
        //    PageDto content = instance.getCurrentPageContent(i);
        //    System.out.println("[1秒阅读时间]read:" + content);
        //    Thread.sleep(1000);
        //    System.out.println(System.currentTimeMillis() - start);
        //}

        PageDto content = instance.getCurrentPageContent(1);
        System.out.println("[1秒阅读时间]read:" + content);
        content = instance.getCurrentPageContent(2);
        System.out.println("[1秒阅读时间]read:" + content);

        content = instance.getCurrentPageContent(1);
        System.out.println("[1秒阅读时间]read:" + content);
        content = instance.getCurrentPageContent(2);
        System.out.println("[1秒阅读时间]read:" + content);

        content = instance.getCurrentPageContent(7);
        System.out.println("[1秒阅读时间]read:" + content);
        content = instance.getCurrentPageContent(8);
        System.out.println("[1秒阅读时间]read:" + content);

        String runtime = t.stop();
        System.out.println("程序运行时间： " + runtime); //00 00:00:10 047



    }

}