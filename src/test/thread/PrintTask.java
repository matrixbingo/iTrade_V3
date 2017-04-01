package test.thread;

import java.util.concurrent.RecursiveAction;

/**
 * 继承RecursiveAction来实现可分解的任务
 * 注意无返回值
 * <p/>
 * *
 */

public class PrintTask extends RecursiveAction {

    //每个小任务，最多只打印50个数
    private static final int threshold = 50;
    //打印任务的开始
    private int start;
    //打印任务的结束
    private int end;

    public PrintTask() {
        // TODO Auto-generated constructor stub
    }


    //打印从start到end之间的任务
    public PrintTask(int start, int end) {
        super();
        this.start = start;
        this.end = end;
    }


    @Override
    protected void compute() {

        if (end - start < threshold) {
            for (int i = start; i < end; i++) {

                System.out.println(Thread.currentThread().getName() + "i的值:" + i);
            }
        } else {
            //当end与start之间的差大于threshold，及打印的数超过50个时，
            //将大任务分解成2个小任务
            int middle = (start + end) / 2;
            PrintTask left = new PrintTask(start, middle);
            PrintTask right = new PrintTask(middle, end);
            //并行执行两个小任务
            left.fork();
            right.fork();

        }


    }
}