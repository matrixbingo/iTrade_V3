-- 010 根据对应周期清洗t_remark对应t_form已经清洗过的数据，返回清洗的t_remark的cno(逗号分隔)
DROP PROCEDURE IF EXISTS zsy_clearRemarkByPeriod;
CREATE  PROCEDURE zsy_clearRemarkByPeriod(IN p_period int) 
BEGIN 
	DECLARE v_loop INT DEFAULT 0; 
	DECLARE v_num INT UNSIGNED; 
	DECLARE str VARCHAR(100) DEFAULT null;
	
	DECLARE data_1 CURSOR FOR select t1.cno from t_remark t1 inner join t_form t2 on t1.cno = t2.cno and t1.period = t2.period where t1.period = p_period; 
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_loop=1;

	OPEN data_1;
	REPEAT
		FETCH data_1 INTO v_num;
			if(v_loop = 0) then 
				if str is null then 
					SET str = v_num;
				else
					SET str = concat(str ,',',v_num);
				end if;
			end if;
	UNTIL v_loop = 1 END REPEAT;
	CLOSE data_1; 
	SET @sql = concat('delete from t_remark where period = ', p_period,' and cno in (',str,')');
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
	select str;
END;

-- 019 未使用 根据表和起始行数，得到page
DROP PROCEDURE IF EXISTS zsy_getPage;
CREATE PROCEDURE zsy_getPage(IN p_table VARCHAR(15) ,IN p_start INT, IN p_end INT)  
BEGIN 

		SET @SQL = CONCAT('select * from ', p_table, ' order by cno asc limit ', p_start, ',', p_end);
		PREPARE stmt FROM @SQL;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
END ;

TRUNCATE TABLE t_break;
TRUNCATE TABLE t_deviate;
TRUNCATE TABLE t_trade;

TRUNCATE TABLE t_charas;
TRUNCATE TABLE t_clear;
TRUNCATE TABLE t_form;
TRUNCATE TABLE t_log;
TRUNCATE TABLE t_macd;
TRUNCATE TABLE t_section;
TRUNCATE TABLE t_stat;
TRUNCATE TABLE t_status;
TRUNCATE TABLE t_section;
TRUNCATE TABLE t_topbtm;

DROP TABLE IF EXISTS `t_ticks`;
CREATE TABLE IF NOT EXISTS `t_ticks` (
	id bigint(14) NOT NULL,
	type TINYINT(4) NOT NULL,
	tick_time bigint(255) NOT NULL,
	ask  DECIMAL(10,5) NOT NULL,
	bid  DECIMAL(10,5) NOT NULL,
	askVol  DECIMAL(10,5), 
	bidVol  DECIMAL(10,5),
	PRIMARY KEY (`id`)
);

DROP PROCEDURE IF EXISTS zsy_addTicks;
create procedure zsy_addTicks(IN p_type TINYINT(4),in p_tick_time bigint(14), in p_ask decimal(10,5), IN p_bid decimal(10,5), in p_askVol decimal(10,5), IN p_bidVol decimal(10,5))  
BEGIN 
	declare v_all int;
	declare v_num int;
	declare v_max int;
	
	select count(1) into v_all from t_ticks;
	IF	v_all > 1000 THEN 
		select MAX(id) into v_max from t_ticks;
		DELETE from t_ticks where id != v_max;
	END IF;

	select id into v_num from t_ticks where type = p_type and tick_time = p_tick_time and ask = p_ask and bid = p_bid;
	IF (v_num is null) THEN
			select (IFNULL(MAX(id),0) + 1) into v_num from t_ticks;
			insert into t_ticks (id, type, tick_time, ask, bid, askVol, bidVol) values(v_num, p_type, p_tick_time, p_ask, p_bid, p_askVol, p_bidVol);
			select 1 as num;
	ELSE
			select 0 as num;
	END IF;
END;


DROP TABLE IF EXISTS `t_candle`;
CREATE TABLE `t_candle` (
   `cno` int(5) NOT NULL,
   `time` bigint(14) NOT NULL,
   `open` decimal(10,5) NOT NULL,
   `close` decimal(10,5) NOT NULL,
   `high` decimal(10,5) NOT NULL,
   `low` decimal(10,5) NOT NULL,
   PRIMARY KEY (`cno`),
   KEY `t_candle_time` (`time`)
);


DROP PROCEDURE IF EXISTS zsy_addCandles;
create procedure zsy_addCandles(in c_time bigint(14), in c_open decimal(10,5), IN c_close decimal(10,5), in c_high decimal(10,5), IN c_low decimal(10,5),
								in p_time bigint(14), in p_open decimal(10,5), IN p_close decimal(10,5), in p_high decimal(10,5), IN p_low decimal(10,5)) 
BEGIN 
	declare v_num int;
	declare v_max int;
	declare v_cno int;
	declare v_cur int;
	
	-- 上个
	select cno into v_cno from t_candle where time = p_time;
	IF (v_cno is not null)  THEN
			UPDATE t_candle set open = p_open, close = p_close, high = p_high, low = p_low where time = p_time;
			select 0 as num;
	ELSE
		select cno into v_num from t_candle where time = p_time and open = p_open and close = p_close and high = p_high and low = p_low;
		IF (v_num is null) THEN
				select (IFNULL(MAX(cno),0) + 1) into v_max from t_candle;
				insert into t_candle(cno, time, open, close, high, low) values(v_max, p_time, p_open, p_close, p_high, p_low);
				select 1 as num;
		END IF;
	END IF;

	-- 当前
	select cno into v_cur from t_candle where time = c_time;
	IF (v_cur is null) THEN
			select (IFNULL(MAX(cno),0) + 1) into v_max from t_candle;
			insert into t_candle(cno, time, open, close, high, low) values(v_max, c_time, c_open, c_close, c_high, c_low);
	ELSE
			UPDATE t_candle set open = c_open, close = c_close, high = c_high, low = c_low where time = c_time;
	END IF;

END;

DROP PROCEDURE IF EXISTS zsy_addCandle;
create procedure zsy_addCandle(in p_time bigint(14), in p_open decimal(10,5), IN p_close decimal(10,5), in p_high decimal(10,5), IN p_low decimal(10,5)) 
BEGIN 

	declare v_cno int;
	declare v_max int;

	select cno into v_cno from t_candle where time = p_time limit 1;
	IF (v_cno is null)  THEN
			select (IFNULL(MAX(cno),0) + 1) into v_max from t_candle;
			replace into t_candle(cno, time, open, close, high, low) VALUES(v_max, p_time, p_open, p_close, p_high, p_low);
			select 0 as num;
	END IF;

END;