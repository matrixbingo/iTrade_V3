package data.jsoup.dto;

import lombok.Data;

/**
 * Created by liang.wang.sh on 2017/1/24.
 */
@Data
public class BigTradeCondtionDto {

    private int type;
    private String code;
    private int time;
    private String name;
    private int page;
    private int pageSize;
    private int bin;
    private int end;
    private int nums;
    private int rabin;
    private int raend;
    private String sort;
    private boolean sortType;

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }


    public boolean isSortType() {
        return sortType;
    }

    public void setSortType(boolean sortType) {
        this.sortType = sortType;
    }

    public int getRabin() {
        return rabin;
    }

    public void setRabin(int rabin) {
        this.rabin = rabin;
    }

    public int getRaend() {
        return raend;
    }

    public void setRaend(int raend) {
        this.raend = raend;
    }

    public int getNums() {
        return nums;
    }

    public void setNums(int nums) {
        this.nums = nums;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getBin() {
        return bin;
    }

    public void setBin(int bin) {
        this.bin = bin;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }
}
