package data.jsoup.dto;

/**
 * Created by liang.wang.sh on 2017/1/24.
 */

public class BigTradeDto {
    private int id;
    private int type;
    private String code;
    private int time;
    private String name;
    private double price;
    private double range;
    private double speed;
    private double stock;
    private int buy;
    private int sel;

    public double getRange() {
        return range;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public void setRange(double range) {
        this.range = range;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public double getStock() {
        return stock;
    }

    public void setStock(double stock) {
        this.stock = stock;
    }

    public int getBuy() {
        return buy;
    }

    public void setBuy(int buy) {
        this.buy = buy;
    }

    public int getSel() {
        return sel;
    }

    public void setSel(int sel) {
        this.sel = sel;
    }
}
