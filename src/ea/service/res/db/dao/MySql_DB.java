package ea.service.res.db.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.mysql.jdbc.CallableStatement;

import ea.server.Controller;

@SuppressWarnings("unused")
public class MySql_DB{

	private SqlSessionFactory sqlSessionFactory = (SqlSessionFactory) Controller.ct.getBean("sqlSessionFactory");
	//private BasicDataSource basicDataSource = (BasicDataSource)Controller.ct.getCurrentWebApplicationContext().getBean("dataSource");  
	
	private String name;
	private Connection conn = null;
	private Statement stmt = null;
	private ResultSet rs = null;
	private PreparedStatement ps = null;

	private static MySql_DB singleInstance = null;
	
	public static MySql_DB getSingleInstance(){
		if (singleInstance == null) {
			synchronized (MySql_DB.class) {
				if (singleInstance == null) {
					singleInstance = new MySql_DB();
				}
			}
		}
		return singleInstance;
	}
	
	public MySql_DB() {
		try {
			//使用连接池得到conn
			//this.conn = this.sqlSessionFactory.getConfiguration().getEnvironment().getDataSource().getConnection();  
			this.conn = this.sqlSessionFactory.openSession().getConnection();  
			// Mysql数据库设置可滚动，可更新的结果集参数  ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_UPDATABLE
			this.stmt = this.conn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	public Connection getConn(){
		try {
			if(null == this.conn || this.conn.isClosed()){
				SqlSession sqlSession = this.sqlSessionFactory.openSession();  
				Connection conn = sqlSession.getConnection();  
				this.conn = this.sqlSessionFactory.getConfiguration().getEnvironment().getDataSource().getConnection();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return this.conn;
	}
	public Statement getStatement(){
		try {
			//可更新结果集 ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_UPDATABLE
			this.stmt = this.getConn().createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return this.stmt;
	}
	public ResultSet executeQuery(String sql) {
		try {
			this.rs = this.getStatement().executeQuery(sql);
		} catch (SQLException ex) {
			System.err.println("executeQuery 错误SQL:" + sql);
			System.err.println("executeQuery 异常:" + ex);
			Controller.log.debug("executeQuery 错误SQL:" + sql);
		}
		return this.rs;
	}

	public void executeUpdate(String sql) {
		try {
			if(this.stmt == null){
				this.stmt = this.getConn().createStatement();
			}
			this.stmt.executeUpdate(sql);
			this.conn.commit();
		} catch (SQLException ex) {
			System.err.println("executeUpdate 错误SQl：" + sql);
			System.err.println("executeQuery 异常:" + ex);
			Controller.log.debug("executeUpdate 错误SQl：" + sql);
		}
	}
	
	public void call(String call){
		CallableStatement cs = null;
		try {
			cs = (CallableStatement) this.getConn().prepareCall(call);
			cs.execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public PreparedStatement prepareUpdate(String sql) {
		try {
			this.ps = this.getConn().prepareStatement(sql);
		} catch (SQLException ex) {
			System.err.println("出错信息: " + ex.getMessage());
			System.err.println("executeUpdate 错误SQl：" + sql);
			Controller.log.debug("executeUpdate 错误SQl：" + sql);
		}
		return this.ps;
	}

	final public void close() {
		try {
			if (this.rs != null) {
				this.rs.close();
			}
			if (this.ps != null) {
				this.ps.close();
			}
			if (this.stmt != null) {
				this.stmt.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void print() {
        System.out.println(this.name);  
    }
}
