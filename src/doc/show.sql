-- 格式化时间简便方法
DROP FUNCTION IF EXISTS zsy_df;
CREATE FUNCTION zsy_df( p_time bigint(14) ) 
RETURNS VARCHAR(255)
BEGIN
    DECLARE str varchar(255) default '';
    SET str =  DATE_FORMAT(p_time,'%Y-%m-%d %H:%i');
    RETURN str; 
END;
-- 根据类型查看
DROP PROCEDURE IF EXISTS zsy_showOrderByType;
CREATE PROCEDURE zsy_showOrderByType(in p_order VARCHAR(20), in p_version int, IN p_type int) 
BEGIN 
	SET @sql = concat
		('	select t2.time, t3.ot_time, t1.version, t1.dir, t1.type, t1.total, t1.sum
				from 
				(
					select version,  1 as dir, type, count(1) as total, sum(ot_price-in_price) as sum from ', p_order, ' where type = ', p_type, ' and dir =  1 and state != 0 and version = ', p_version,'
						union all 
					select version, -1 as dir, type, count(1) as total, sum(in_price-ot_price) as sum from ', p_order, ' where type = ', p_type, ' and dir = -1 and state != 0 and version = ', p_version,'
				) t1 left join 
				(
					select	zsy_df(time) as time from t_candle_05 where cno = (select max(cno) from t_clear where period = 5)
				) t2 on 1=1
				LEFT JOIN 
				(
					select max(ot_time) ot_time from t_order
				) t3 on 1=1
	 ');

		PREPARE stmt FROM @sql;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
END;
-- 查看全部
DROP PROCEDURE IF EXISTS zsy_showTotal;
CREATE PROCEDURE zsy_showTotal(in p_order VARCHAR(20)) 
BEGIN 
	SET @sql = concat
	('
		select t2.time,count(1) as total, sum(case t1.dir when -1 then t1.in_price-t1.ot_price when 1 then t1.ot_price-t1.in_price end) as sum from ', p_order, ' t1
		left join 
		(
			select zsy_df(time) as time from t_candle_05 where cno = (select max(cno) from t_clear where period = 5)
		) t2 on 1=1
		where  t1.state != 0;
	');
		PREPARE stmt FROM @sql;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
END;
-- 
DROP PROCEDURE IF EXISTS zsy_showOrderMonth;
CREATE PROCEDURE zsy_showOrderMonth(IN p_year INT)  
BEGIN 
	
	select CONCAT( p_year,'01') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0101000000') and ot_time < CONCAT( p_year,'0201000000')

	union all 

	select CONCAT( p_year,'02') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0201000000') and ot_time < CONCAT( p_year,'0301000000')

	union all 

	select CONCAT( p_year,'03') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0301000000') and ot_time < CONCAT( p_year,'0401000000')

	union all 

	select CONCAT( p_year,'04') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0401000000') and ot_time < CONCAT( p_year,'0501000000')

	union all 

	select CONCAT( p_year,'05') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0501000000') and ot_time < CONCAT( p_year,'0601000000')

	union all 

	select CONCAT( p_year,'06') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0601000000') and ot_time < CONCAT( p_year,'0701000000')

	union all 

	select CONCAT( p_year,'07') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0701000000') and ot_time < CONCAT( p_year,'0801000000')

	union all 

	select CONCAT( p_year,'08') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0801000000') and ot_time < CONCAT( p_year,'0901000000')

	union all 

	select CONCAT( p_year,'09') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'0901000000') and ot_time < CONCAT( p_year,'1001000000')

	union all 

	select CONCAT( p_year,'10') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'1001000000') and ot_time < CONCAT( p_year,'1101000000')

	union all 

	select CONCAT( p_year,'11') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'1101000000') and ot_time < CONCAT( p_year,'1201000000')

	union all 

	select CONCAT( p_year,'12') as mon, count(1) as total, sum(case dir when -1 then in_price-ot_price when 1 then ot_price-in_price end) as sum  from t_order where state != 0 and ot_time >= CONCAT( p_year,'1201000000') and ot_time < CONCAT( (p_year+1) ,'0101000000')
	;
END ;