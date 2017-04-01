package test;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class inertDB {
    public static String URL = "D:/kdj.csv";

    public static Map<Integer, String> map = new HashMap<Integer, String>();

    public static void readFileByLines(String fileName) {
        File file = new File(fileName);
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String FileAddress = null;
            int line = 1;
            while ((FileAddress = reader.readLine()) != null) {
                // System.out.println("line " + line + ": " + FileAddress);
                put(FileAddress);
                line++;
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                }
            }
        }

        inert();
    }

    private static void put(String str) {
        String[] arr = str.split("=");
        int cno = Integer.parseInt(arr[0].trim()) + 1;
        map.put(cno, str);
    }

    private static void inert() {
        int size = map.size() + 1;
        for (int i = 1; i < size; i++) {
            String str = map.get(i);
            String[] arr = str.split("=");
            int cno = Integer.parseInt(arr[0].trim()) + 1;

            String[] kLines = arr[1].split("\\|");
            String time = kLines[0].trim().replaceAll("\\.", "").replaceAll(" ", "").replaceAll(":", "");
            String open = kLines[1].trim();
            String close = kLines[2].trim();
            String high = kLines[3].trim();
            String low = kLines[4].trim();
            String sql = "replace into t_candle_30(cno, time, open, close, high, low) values(" + cno + "," + time + ","
                    + open + "," + close + "," + high + "," + low + ");";
             System.out.println(sql);

            String[] kdjs = arr[2].split("\\|");
            String k = kdjs[0].trim();
            String d = kdjs[1].trim();
            String j = "0";
            sql = "replace into t_kdj(period, cno, k, d, j) values(30," + cno + "," + k + "," + d + "," + j + ");";
            ///System.out.println(sql);
        }
    }

    public static void main(String[] args) {
        inertDB.readFileByLines(URL);

    }

}
