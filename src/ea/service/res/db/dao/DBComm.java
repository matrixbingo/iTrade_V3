package ea.service.res.db.dao;

import ea.server.Data;

import java.sql.ResultSet;
import java.sql.SQLException;



public class DBComm{
	
	protected static MySql_DB db = MySql_DB.getSingleInstance();
	
	/**
	 * 执行更新SQL语句
	 */
	public static void executeUpdate(String sql){
		if(null != sql){
			Data.exeDataControl.exeSql(sql);
		}
	}
	
	/**
	 * 执行查询SQL语句
	 */
	public static ResultSet executeQuery(String sql){
		ResultSet rs = null;
		if(null != sql){
			rs = DBComm.db.executeQuery(sql);
		}
		return rs;
	}
	
	/**
	 * 根据sql得到long，如果没有则返回0
	 */
	public static long getNum(String sql, String key){
		long num = 0;
		if(null == sql){
			return num;
		}
		ResultSet rs = DBComm.executeQuery(sql);
		try {
			while(rs.next()){
				num = rs.getLong(key);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return num;
	}
	
	/**
	 * 根据sql得到long，如果没有则返回0
	
	public static long getNum(String sql){
		long num = 0;
		if(null == sql){
			return num;
		}
		return Data.getDataControl.exeSqlToDto(sql).getNum();
	}
	 */
	/**
	 * 根据sql得到String，如果没有则返回 null
	 * @param sql
	 * @param key
	 * @return
	 */
	public static String getStr(String sql, String key){
		String tmax = null;
		if(null == sql){
			return null;
		}
		ResultSet rs = DBComm.executeQuery(sql);
		try {
			while(rs.next()){
				tmax = rs.getString("tmax");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return tmax;
	}
	/**
	 * 判断查询结果是否存在，存在返回true
	 * @param sql
	 * @return
	 */
	public static boolean isExist(String sql){
		ResultSet rs = DBComm.executeQuery(sql);
		boolean flag = false;
		try {
			while(rs.next()){
				flag = true;
				break;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return flag;
	}
}
