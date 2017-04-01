package data.jsoup.enums;

public enum VolumeTypeEnum {

    Small_More_9000_Type(1, "小盘>9000"),
    Middle_More_9000_Type(2, "中盘>9000"),
    Small_1000_9000_Type(3, "小盘1000~9000"),
    Middle_3000_9000_Type(4, "中盘3000~9000");

    VolumeTypeEnum(int code, String key) {
        this.code = code;
        this.key = key;
    }

    private int code;

    private String key;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}
