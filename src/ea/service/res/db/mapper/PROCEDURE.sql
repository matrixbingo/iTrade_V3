-- 建表
DROP TABLE IF EXISTS `t_remark`;
CREATE TABLE IF NOT EXISTS  `t_remark` (
   `period` int(1) NOT NULL,
   `cno` int(4) NOT NULL,
   `type` int(2) NOT NULL,
   `dir` int(2) NOT NULL,
   `time` bigint(14) NOT NULL,
   `price` decimal(10,4) DEFAULT NULL,
   `bno` int(4) DEFAULT NULL,
   PRIMARY KEY (`period`,`cno`,`type`,`dir`),
   KEY `indx_bno` (`bno`)
);
DROP TABLE IF EXISTS `t_trade`;
CREATE TABLE IF NOT EXISTS `t_trade` (
   `id` INT(5) NOT NULL,
   `cno` INT(5) NOT NULL,
   `type` INT(2) NOT NULL,
   `dir` INT(2) DEFAULT NULL,
   `iprice` DECIMAL(10,4) NOT NULL,
   `oprice` DECIMAL(10,4) DEFAULT NULL,
   `itime` BIGINT(14) NOT NULL,
   `otime` BIGINT(14) DEFAULT NULL,
   PRIMARY KEY (`id`)
 )

DROP TABLE IF EXISTS `t_deviate`;
CREATE TABLE `t_deviate` (
   `period` INT(2) NOT NULL,
   `cno` INT(6) NOT NULL,
   `updn` INT(2) NOT NULL,
   `dir` INT(1) NOT NULL,
   `dev_cno` INT(6) DEFAULT NULL,
   `price` DECIMAL(10,4) DEFAULT NULL,
   `time` BIGINT(14) NOT NULL,
   `del` INT(1) NOT NULL DEFAULT '0',
   `delcno` INT(6) NOT NULL DEFAULT '0',
   `kdif1` INT(4),
   `kdif2` INT(4),
   `ang1` INT(4),
   `ang2` INT(4),
   `ang3` INT(4),
   `md1` INT(4),
   `cnos` VARCHAR(100),
   PRIMARY KEY (`cno`,`period`,`updn`,`dir`)
)
DROP TABLE IF EXISTS `t_break`;
CREATE TABLE `t_break` (
   `ecno` INT(6) NOT NULL,
   `period` INT(2) NOT NULL,
   `cno` INT(6) NOT NULL, 		--对应5分钟
   `brk_cno` INT(6) NOT NULL,	--对应一分钟
   `updn` INT(2) NOT NULL,
   `valid` INT(6) NOT NULL DEFAULT '0',
   `dir` INT(1) DEFAULT NULL,
   `price` DECIMAL(10,4) DEFAULT NULL,
   `time` BIGINT(14) NOT NULL,
   PRIMARY KEY (`period`,`ecno`,`updn`,`dir`)
 )
 DROP TABLE IF EXISTS `t_kd`;
 CREATE TABLE `t_kd` (
  `period` int(11) NOT NULL,
  `cno` int(11) NOT NULL,
  `time` bigint(14) NOT NULL,
  `K` decimal(10,5) NOT NULL,
  `D` decimal(10,5) NOT NULL,
  PRIMARY KEY (`period`,`cno`)
) 
 -- 缺失的k线数据表
DROP TABLE IF EXISTS `t_misData`;
CREATE TABLE IF NOT EXISTS  `t_misData` (
   `period` int(2) NOT NULL,
   `time` bigint(14) NOT NULL
);

-- 全部年份停盘时间表
DROP TABLE IF EXISTS `t_stoptime`;
CREATE TABLE IF NOT EXISTS  `t_stoptime` (
   `year` int(4) NOT NULL,
   `b_time` bigint(14) NOT NULL,
   `e_time` bigint(14) NOT NULL,
   `total` int(5) NOT NULL
);

DROP TABLE IF EXISTS `t_order`;
CREATE TABLE `t_order` (
	`version` TinyInt NOT NULL,            
	`ecno` int(11) NOT NULL,            
	`type` int(11) NOT NULL,            
	`icno` int(11) NOT NULL,            
	`ocno` int(11) NOT NULL,            
	`dir` int(11) NOT NULL,             
	`state` int(11) NOT NULL,           
	`in_dvt05` int(11) NOT NULL,        
	`in_dvt10` int(11) NOT NULL,        
	`in_dvt30` int(11) NOT NULL,        
	`in_brk05_dvt` int(11) NOT NULL,    
	`in_brk10_dvt` int(11) NOT NULL,    
	`ot_dvt05` int(11) NOT NULL,        
	`ot_dvt10` int(11) NOT NULL,        
	`topbtm` int(11) NOT NULL,
	`in_price` decimal(10,4) DEFAULT NULL, 
  	`ot_price` decimal(10,4) DEFAULT NULL,
	`in_time` bigint(14) DEFAULT NULL,
	`ot_time` bigint(14) DEFAULT NULL,
	PRIMARY KEY (`version`,`ecno`,`type`,`dir`)
)

-- 创建索引
CREATE INDEX t_candle_time ON t_candle (time);
CREATE INDEX t_candle_time ON t_candle_05 (time);
CREATE INDEX t_candle_time ON t_candle_10 (time);
CREATE INDEX t_candle_time ON t_candle_30 (time);
CREATE INDEX index_1 ON t_remark (period, cno, type, dir);

ALTER TABLE t_candle_05 DROP COLUMN uses;
ALTER TABLE t_candle_10 DROP COLUMN uses;
ALTER TABLE t_candle_30 DROP COLUMN uses;

/***** 创建存储过程 ****/

delimiter //
-- 001 得到行数
DROP PROCEDURE IF EXISTS zsy_getCount;
CREATE PROCEDURE zsy_getCount(IN p_table VARCHAR(20))
BEGIN
	SET @sql = concat('select count(*) num from ', p_table);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 002 得到最大id值
DROP PROCEDURE IF EXISTS zsy_getMaxId;
CREATE PROCEDURE zsy_getMaxId(IN p_table VARCHAR(20))
BEGIN
	SET @sql = concat('select max(id) num from ', p_table);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

DROP PROCEDURE IF EXISTS zsy_getMaxCno;
CREATE PROCEDURE zsy_getMaxCno(IN p_table VARCHAR(20))
BEGIN
	SET @sql = concat('select max(cno) num from ', p_table);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 003 得到开始和结束时间
DROP PROCEDURE IF EXISTS zsy_getMaxMinTime;
CREATE PROCEDURE zsy_getMaxMinTime(IN p_table VARCHAR(20))
BEGIN
	SET @sql = concat('select max(time) end, min(time) bin from ', p_table);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 004 判断时间是否存在
DROP PROCEDURE IF EXISTS zsy_isUniqueTime;
CREATE PROCEDURE zsy_isUniqueTime(IN p_table VARCHAR(20),IN p_time bigint(14))
BEGIN
	SET @sql = concat('select count(1) AS num from ', p_table , ' where time = ' , p_time);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 005 得到t_clear表已经刷新的数据量
DROP PROCEDURE IF EXISTS zsy_getClearNumByPeriod;
CREATE PROCEDURE zsy_getClearNumByPeriod(IN p_period int)
BEGIN
	select count(*) AS num from t_clear where period =  p_period;
END;

-- 006 根据周期和时间得到对应的CNO 
DROP PROCEDURE IF EXISTS zsy_getCnoByTime;
CREATE PROCEDURE zsy_getCnoByTime(IN $tableName VARCHAR(20),IN $time bigint(14))
BEGIN
	SET @sql = concat('select cno AS num from ', $tableName , ' where time = ' , $time);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 007 得到特征序列高低点
DROP PROCEDURE IF EXISTS zsy_getSection;
CREATE PROCEDURE zsy_getSection(IN p_period INT,IN p_time bigint(14))
BEGIN
	CALL com_fnd_top(p_period,p_time,@q1,@q2,@q3,@q4,@q5,@q6);
	SELECT @q1 AS top_cno,@q2 AS top_time,@q3 AS top_price,@q4 AS top_cno,@q5 AS bot_time,@q6 AS bot_price;
END;

-- 008 暂不使用 按条件检查remark表是否存在数据  0:无   1:有
DROP PROCEDURE IF EXISTS zsy_isExistRemark;
CREATE PROCEDURE zsy_isExistRemark(IN $period int,in $cno int, in $type int, IN $dir int)
BEGIN
	select count(1) as num from t_remark where period = $period and cno = $cno and type = $type and dir = $dir;
END;

-- 009 添加remark数据
DROP PROCEDURE IF EXISTS zsy_addRemark;
create procedure zsy_addRemark(IN p_period int,in p_cno int, in p_type int, IN p_dir int, IN p_time bigint(14), IN p_price decimal(10,4), IN p_bno int)  
BEGIN 
	declare v_num int;
	select cno into v_num from t_remark where period = p_period and cno = p_cno and type = p_type and dir = p_dir;
	IF (v_num is null) THEN
			insert into t_remark(period,cno,type,dir,time,price,bno) values(p_period, p_cno, p_type, p_dir, p_time, p_price, p_bno);
			select 1 as num;
	ELSE
			select 0 as num;
	END IF;
END ;

-- 010 根据对应周期清洗t_remark对应t_form已经清洗过的数据，并返回清洗的结果集period和cno
DROP PROCEDURE IF EXISTS zsy_clearRemarkByPeriod;
CREATE  PROCEDURE zsy_clearRemarkByPeriod(IN p_periods VARCHAR(10)) 
BEGIN 
			DECLARE v_loop INT DEFAULT 0; 
			DECLARE v_num INT UNSIGNED; 
			DECLARE str VARCHAR(100) DEFAULT null;
			-- 临时表
 			drop table if EXISTS temp_tab_1;
			CREATE TEMPORARY TABLE temp_tab_1(
				period INT,
				cno INT 
			)ENGINE=MyISAM DEFAULT CHARSET=utf8;

			set @sqls = concat('insert into temp_tab_1(period, cno) 
								select t1.period, t1.cno from t_remark t1 
								inner join t_form t2 on t1.cno = t2.cno and t1.period = t2.period 
								where t1.period in (', p_periods ,') or 0 in (', p_periods ,')');
		
			PREPARE stmt FROM @sqls;
			EXECUTE stmt;
			DEALLOCATE PREPARE stmt;
			
			select * from temp_tab_1;
			DELETE s.* FROM t_remark s INNER JOIN temp_tab_1 n ON s.period = n.period and s.cno = n.cno;
END;

-- 011 根据cno或time得到k线数据 isTest:1 测试 0:运行
DROP PROCEDURE IF EXISTS zsy_getCandle;
CREATE PROCEDURE zsy_getCandle(IN p_table VARCHAR(20),IN p_isTest int,IN p_period int,IN p_cno int,IN p_time bigint(14))
BEGIN
	DECLARE cond VARCHAR(50);
	if p_isTest = 1 && p_cno <> -1 THEN
		SET @sql = concat('select ', p_period , ' period, cno,time,open,close,high,low 
							from ', p_table , ' where cno = ', p_cno);
	elseif p_isTest = 1 && p_cno = -1 THEN
		SET @sql = concat('select ', p_period , ' period, cno,time,open,close,high,low 
							from ', p_table , ' where time = ', p_time);
	elseif p_isTest = 0 THEN
		SET @sql = concat('select ', p_period , ' period, cno,time,open,close,high,low 
							from ', p_table , ' where cno = (select max(cno) from ', p_table , ')');
	END IF;
	
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 012 根据CNO或time,得到笔段信息 
DROP PROCEDURE IF EXISTS zsy_getFenBiInfoByType;
CREATE PROCEDURE zsy_getFenBiInfoByType(IN p_table VARCHAR(20),IN p_period int, IN p_cno int, IN p_time bigint(14))
BEGIN
		SET @sql = concat
		('select A.cno,A.topbtm,B.time,(CASE A.topbtm WHEN 1 THEN B.high else B.low end) AS price 
			from t_form A 
			INNER JOIN ', p_table,' B on A.cno = B.cno 
			where A.period =', p_period,'
			and (B.cno <= ',p_cno,' or B.time <= ',p_time,')
			ORDER BY A.cno desc limit 0,6');

		PREPARE stmt FROM @sql;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
END;

-- 013 得到MACD区间最值
DROP PROCEDURE IF EXISTS zsy_getRangeMacdExt;
CREATE PROCEDURE zsy_getRangeMacdExt(IN p_table VARCHAR(20),IN p_period int, IN p_c1 int, IN p_c2 int, IN p_c3 int, IN p_c4 int, IN p_c5 int, IN p_c6 int)
BEGIN
		SET @sql = concat
		('
			select 1 as row, max(bar) max, min(bar) min from ',p_table, ' where period = ',p_period, ' and cno >= ',p_c2, ' and cno <= ',p_c1, '
				UNION  ALL
			select 2 as row, max(bar) max, min(bar) min from ',p_table, ' where period = ',p_period, ' and cno >= ',p_c3, ' and cno <= ',p_c2, '
				UNION ALL
			select 3 as row, max(bar) max, min(bar) min from ',p_table, ' where period = ',p_period, ' and cno >= ',p_c4, ' and cno <= ',p_c3, '
				UNION ALL
			select 4 as row, max(bar) max, min(bar) min from ',p_table, ' where period = ',p_period, ' and cno >= ',p_c5, ' and cno <= ',p_c4, '
				UNION ALL
			select 5 as row, max(bar) max, min(bar) min from ',p_table, ' where period = ',p_period, ' and cno >= ',p_c6, ' and cno <= ',p_c5, '
		');

		PREPARE stmt FROM @sql;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
END;

-- 014 得到区间价格最值
DROP PROCEDURE IF EXISTS zsy_getPriceDto;
CREATE PROCEDURE zsy_getPriceDto(IN p_start bigint(14), IN p_end bigint(14))
BEGIN
	select max(high) maxPrice, min(low) minPrice 
	from t_candle 
	where time BETWEEN p_start and p_end;
END;

-- 015 根据5分钟cno得到一分钟candle
DROP PROCEDURE IF EXISTS zsy_getM1CandleByM5Cno;
CREATE PROCEDURE zsy_getM1CandleByM5Cno(IN p_cno int)
BEGIN
	select t1.* from t_candle t1 
	inner join t_candle_05 t2 on t1.time = t2.time 
	where t2.cno = p_cno;
END;

-- 016 添加dev数据,联合主键重复不添加
DROP PROCEDURE IF EXISTS zsy_addDevRemark;
create procedure zsy_addDevRemark(IN p_period int,in p_cno int, in p_updn int, IN p_dir int, IN p_dev_cno int, IN p_price decimal(10,4), IN p_time bigint(14),
								  IN p_kdif1 int,IN p_kdif2 int, IN p_ang1 int,IN p_ang2 int,IN p_ang3 int,IN p_md1 int,in p_cnos VARCHAR(100))  
BEGIN 
	declare v_num int;
	select cno into v_num from t_deviate where period = p_period and cno = p_cno and updn = p_updn and dir = p_dir;
	IF (v_num is null) THEN
			insert into t_deviate(period,cno,updn,dir,dev_cno,price,time,kdif1,kdif2,ang1,ang2,ang3,md1,cnos) values(p_period,p_cno,p_updn,p_dir,p_dev_cno,p_price,p_time,p_kdif1,p_kdif2,p_ang1,p_ang2,p_ang3,p_md1,p_cnos);
			select 1 as num;
	ELSE
			select 0 as num;
	END IF;
END ;

-- 017 根据对应周期返回清洗的结果集period和cno 
DROP PROCEDURE IF EXISTS zsy_getclearCnoPeriods;
CREATE  PROCEDURE zsy_getclearCnoPeriods(in p_dev int,in p_brk int) 
BEGIN 
			select p_brk as num, t1.updn, t1.period,t1.ecno as cno,t1.dir from t_break t1
			inner join t_form t2 on t2.cno=t1.ecno and t1.period=t2.period
			where t1.valid = 1
			union all 
			select p_dev as num, t1.updn, t1.period,t1.cno,t1.dir from t_deviate t1
			inner join t_form t3 on t1.cno=t3.cno and t1.period=t3.period
			where t1.del = 1;
END;

-- 018 添加brk数据,联合主键重复不添加
DROP PROCEDURE IF EXISTS zsy_addBrkRemark;
CREATE PROCEDURE zsy_addBrkRemark(IN p_period INT,IN p_ecno INT, IN p_updn INT, IN p_dir INT, IN p_cno INT,IN p_brk_cno INT, IN p_price DECIMAL(10,4), IN p_time bigint(14))  
BEGIN 
	DECLARE v_num INT;
	SELECT cno INTO v_num FROM t_break WHERE period = p_period AND ecno = p_ecno AND updn = p_updn AND dir = p_dir;
	IF (v_num IS NULL) THEN
		INSERT INTO t_break(ecno,period,cno,brk_cno,updn,dir,price,time) VALUES(p_ecno,p_period,p_cno,p_brk_cno,p_updn,p_dir,p_price,p_time);
		SELECT 1 AS num;
	ELSE
		SELECT 0 AS num;
	END IF;
END ;

-- 019 得到分页数据的开始和结束时间
DROP PROCEDURE IF EXISTS zsy_getPageTime;
CREATE PROCEDURE zsy_getPageTime(IN p_table VARCHAR(15) ,IN p_start INT, IN p_end INT)  
BEGIN 
	SET @SQL = CONCAT('select min(time) as bin, max(time) as end from ', p_table , ' where cno > ', p_start , ' AND cno <= ', p_end);
	PREPARE stmt FROM @SQL;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END ;


DROP PROCEDURE IF EXISTS zsy_getPageNum;

-- 020 得到各周期对应的页信息
DROP PROCEDURE IF EXISTS zsy_getPageNum;
CREATE  PROCEDURE zsy_getPageNum(in p_table VARCHAR(15), in p_page int) 
BEGIN 
		DECLARE v_num INT DEFAULT 0;
		DECLARE i int DEFAULT 1;
		-- 临时表
		drop table if EXISTS temp_tab_1;
		CREATE TEMPORARY TABLE temp_tab_1(
			count INT 
		)ENGINE=MyISAM DEFAULT CHARSET=utf8;

		set @sqls = concat('insert into temp_tab_1(count) SELECT count(1) from ', p_table);

		PREPARE stmt FROM @sqls;
		EXECUTE stmt;
		select count into v_num from temp_tab_1;

		set v_num = floor(v_num/p_page) + if(mod(v_num,p_page)=0,0,1);
		set @sqls = '';
		WHILE i <= v_num DO
			if i < v_num THEN
				set @sqls = concat(@sqls, 'select ',i ,' as num, min(time) as bin , max(time) as end from ', p_table , ' where cno > ', (i-1)*p_page , ' AND cno <= ', i*p_page,' union all ');
			ELSEIF i = v_num THEN
				set @sqls = concat(@sqls, 'select ',i ,' as num, min(time) as bin , max(time) as end from ', p_table , ' where cno > ', (i-1)*p_page , ' AND cno <= ', i*p_page);
			end if;
		SET i=i+1;
		END WHILE;
		
		PREPARE stmt FROM @sqls;
		EXECUTE stmt;
		DEALLOCATE PREPARE stmt;
END;

-- 021 按年份得到停盘时间的集合
DROP PROCEDURE IF EXISTS zsy_getStopTimeByYear;
CREATE PROCEDURE zsy_getStopTimeByYear(IN p_time INT)  
BEGIN 
	select total as num, b_time as bin, e_time as end from t_stoptime where year = p_time;
END ;

-- 022 根据CNO得到K线数据
DROP PROCEDURE IF EXISTS zsy_getKdataByCno;
CREATE PROCEDURE zsy_getKdataByCno(in p_period int, IN p_cno int)  
BEGIN
	IF p_period = 5 THEN
		select cno, time, open, close, high, low from t_candle_05 where cno = p_cno;
	ELSEIF p_period = 10 THEN
		select cno, time, open, close, high, low from t_candle_10 where cno = p_cno;
	ELSEIF p_period = 30 THEN
		select cno, time, open, close, high, low from t_candle_30 where cno = p_cno;
	ELSEIF p_period = 60 THEN
		select cno, time, open, close, high, low from t_candle_60 where cno = p_cno;
	ELSEIF p_period = 240 THEN
		select cno, time, open, close, high, low from t_candle_240 where cno = p_cno;
	END IF;
END ;

-- 023 根据周期和起始CNO得到分页数据
DROP PROCEDURE IF EXISTS zsy_getPageData;
CREATE PROCEDURE zsy_getPageData(in p_period int, IN p_bin int, in p_end int)  
BEGIN
	IF p_period = 1 THEN
		select cno, time, open, close, high, low from t_candle_05 where cno > p_bin and cno <= p_end order by cno asc;
	ELSEIF p_period = 5 THEN
		select cno, time, open, close, high, low from t_candle_05 where cno > p_bin and cno <= p_end order by cno asc;
	ELSEIF p_period = 10 THEN
		select cno, time, open, close, high, low from t_candle_10 where cno > p_bin and cno <= p_end order by cno asc;
	ELSEIF p_period = 30 THEN
		select cno, time, open, close, high, low from t_candle_30 where cno > p_bin and cno <= p_end order by cno asc;
	END IF;
END ;

-- 024（放在clr_set中自动调用） 30分钟 其他周期需要另建 可取代12,13 取macd区间值和Fx信息，被clr_set运行时调用
DROP PROCEDURE IF EXISTS zsy_getFxMacdInfo;
CREATE  PROCEDURE zsy_getFxMacdInfo(IN p_period int,in p_cno INT) 
BEGIN 
		IF p_period = 5 THEN
			call zsy_getFxMacdInfo_M05(p_period, p_cno);
		ELSEIF p_period = 10 THEN
			call zsy_getFxMacdInfo_M10(p_period, p_cno);
		ELSEIF p_period = 30 THEN
			call zsy_getFxMacdInfo_M30(p_period, p_cno);
		END IF;
END;

-- 024(被24调用) 30分钟 其他周期需要另建 可取代12,13 取macd区间值和Fx信息，被clr_set运行时调用
DROP PROCEDURE IF EXISTS zsy_getFxMacdInfo_M05;
CREATE  PROCEDURE zsy_getFxMacdInfo_M05(IN p_period int,in p_cno INT) 
BEGIN 
	DECLARE v_loop 		INT DEFAULT 0;
	DECLARE v_table		VARCHAR(15);
	DECLARE v_num 		INT DEFAULT 1; 
	DECLARE v_cno, v_topbtm, p_type		INT DEFAULT 0;
	DECLARE v_time		bigint(14) DEFAULT 0;
	DECLARE v_price 	decimal(10,4) DEFAULT 0;
	DECLARE p_c1, p_c2, p_c3, p_c4, p_c5, p_c6	INT DEFAULT 0;
	DECLARE p_t1, p_t2, p_t3, p_t4, p_t5, p_t6	bigint(14)  DEFAULT 0;
	DECLARE p_p1, p_p2, p_p3, p_p4, p_p5, p_p6	decimal(10,4)  DEFAULT 0;

	DECLARE data_1 CURSOR FOR SELECT A.cno,A.topbtm,B.time,(CASE A.topbtm WHEN 1 THEN B.high else B.low end) AS price from t_form A INNER JOIN  t_candle_05  B on A.cno = B.cno where A.period = p_period and A.del = 0 and B.cno <= p_cno ORDER BY A.cno desc limit 0,6;
  	DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_loop=1;

	OPEN data_1;
	REPEAT
		FETCH data_1 INTO v_cno, v_topbtm,v_time,v_price;
			if(v_loop = 0) then 
				if v_num = 1 then 
					SET p_c1 = v_cno, p_type = v_topbtm, p_t1 = v_time, p_p1 = v_price;
				elseif v_num = 2 then
					SET p_c2 = v_cno, p_t2 = v_time, p_p2 = v_price;
				elseif v_num = 3 then
					SET p_c3 = v_cno, p_t3 = v_time, p_p3 = v_price;
				elseif v_num = 4 then
					SET p_c4 = v_cno, p_t4 = v_time, p_p4 = v_price;
				elseif v_num = 5 then
					SET p_c5 = v_cno, p_t5 = v_time, p_p5 = v_price;
				elseif v_num = 6 then
					SET p_c6 = v_cno, p_t6 = v_time, p_p6 = v_price;
				end if;
				set v_num = v_num+1;
			end if;
	UNTIL v_loop = 1 END REPEAT;
	CLOSE data_1;

	select 1 as row, max(bar) max, min(bar) min ,0 as q0, 0 as q1, 0 as q2, 0 as q3, 0 as q4, 0 as q5, 0 as q6 from t_macd where period = p_period and cno >= p_c2 and cno <= p_c1
		UNION  ALL
	select 2 as row, max(bar) max, min(bar) min ,0 as q0, 0 as q1, 0 as q2, 0 as q3, 0 as q4, 0 as q5, 0 as q6 from t_macd where period = p_period and cno >= p_c3 and cno <= p_c2
		UNION ALL
	select 3 as row, max(bar) max, min(bar) min ,0 as q0, 0 as q1, 0 as q2, 0 as q3, 0 as q4, 0 as q5, 0 as q6 from t_macd where period = p_period and cno >= p_c4 and cno <= p_c3
		UNION ALL
	select 4 as row, max(bar) max, min(bar) min ,0 as q0, 0 as q1, 0 as q2, 0 as q3, 0 as q4, 0 as q5, 0 as q6 from t_macd where period = p_period and cno >= p_c5 and cno <= p_c4
		UNION ALL
	select 5 as row, max(bar) max, min(bar) min ,0 as q0, 0 as q1, 0 as q2, 0 as q3, 0 as q4, 0 as q5, 0 as q6 from t_macd where period = p_period and cno >= p_c6 and cno <= p_c5
		UNION ALL						
	select 6 as row, 0,	0,	p_type, p_c1, p_c2, p_c3, p_c4, p_c5, p_c6
		UNION ALL
	select 7 as row, 0, 0,	v_num , p_t1, p_t2, p_t3, p_t4, p_t5, p_t6
		UNION ALL
	select 8 as row, 0, 0,	0 , p_p1, p_p2, p_p3, p_p4, p_p5, p_p6;
END;


-- 025 根据年份保存表数据
DROP PROCEDURE IF EXISTS zsy_saveTable;
CREATE PROCEDURE zsy_saveTable(IN p_table VARCHAR(20),in p_year int)
BEGIN
	DECLARE v_table VARCHAR(100) DEFAULT null;
	SET v_table = concat(p_table,'_', p_year);
	SET @sql = concat('drop table if EXISTS ',v_table);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	SET @sql = concat('CREATE TABLE ', v_table, ' SELECT * from ', p_table);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 026 转换成内存表
DROP PROCEDURE IF EXISTS zsy_changeEngine;
CREATE PROCEDURE zsy_changeEngine(IN p_table VARCHAR(20),IN p_type VARCHAR(10))
BEGIN
	SET @sql = concat('alter table ', p_table ,' engine=', p_type);
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 027 添加进场
DROP PROCEDURE IF EXISTS zsy_addOrder;
create procedure zsy_addOrder(IN p_version int,IN p_ecno int,in p_type int, 
								in p_icno int, IN p_ocno int, 
								IN p_dir int, IN p_state int, 
								IN p_in_dvt05 int,IN p_in_dvt10 int,IN p_in_dvt30 int,
								IN p_in_brk05_dvt int,IN p_in_brk10_dvt int,
								IN p_ot_dvt05 int,IN p_ot_dvt10 int,IN p_topbtm int,
								IN p_in_price decimal(10,4) , IN p_ot_price decimal(10,4),
								IN p_in_time bigint(14),IN p_ot_time bigint(14))  
BEGIN 

			insert into t_order(version,  ecno,  type,  icno,   ocno,  dir,  state,   in_dvt05,  in_dvt10,  in_dvt30,  in_brk05_dvt,  in_brk10_dvt,  ot_dvt05,  ot_dvt10,  topbtm,  in_price,   ot_price,   in_time,  ot_time) 
			             values(p_version, p_ecno,p_type,p_icno, p_ocno,p_dir,p_state, p_in_dvt05,p_in_dvt10,p_in_dvt30,p_in_brk05_dvt,p_in_brk10_dvt,p_ot_dvt05,p_ot_dvt10,p_topbtm,p_in_price, p_ot_price,	p_in_time,p_ot_time);

END ;

-- 028 更新进场单 过滤掉 1:处理完成, 2:废止
DROP PROCEDURE IF EXISTS zsy_updateOrder;
create procedure zsy_updateOrder(in p_version int, IN p_ecno int,in p_type int, 
								in p_icno int, IN p_ocno int, 
								IN p_dir int, IN p_state int, 
								IN p_in_dvt05 int,IN p_in_dvt10 int,IN p_in_dvt30 int,
								IN p_in_brk05_dvt int,IN p_in_brk10_dvt int,
								IN p_ot_dvt05 int,IN p_ot_dvt10 int,IN p_topbtm int,
								IN p_in_price decimal(10,4) , IN p_ot_price decimal(10,4),
								IN p_in_time bigint(14),IN p_ot_time bigint(14))  
BEGIN 

			update t_order set  ocno = p_ocno, state = p_state, in_dvt05 = p_in_dvt05, in_dvt10 = p_in_dvt10,  
								in_dvt30 = p_in_dvt30, in_brk05_dvt = p_in_brk05_dvt, in_brk10_dvt = p_in_brk10_dvt, ot_dvt05 = p_ot_dvt05,  
								ot_dvt10 = p_ot_dvt10,  topbtm = p_topbtm, in_price = p_in_price, ot_price = p_ot_price, in_time = p_in_time, 
								ot_time = p_ot_time 
			where version = p_version and ecno = p_ecno and type = p_type and dir = p_dir and state != 1 and state != 2;

END ;

-- 029 不出现新的分笔则返回0
DROP PROCEDURE IF EXISTS zsy_exeFx;
CREATE PROCEDURE zsy_exeFx(IN p_period int,in p_cno INT, in p_fx_cno int) 
BEGIN 
	DECLARE v_num INT DEFAULT 0;
	CALL clr_set(p_period, p_cno);

	select max(cno) into v_num from t_form where period = p_period;
	if v_num != p_fx_cno THEN
		CALL zsy_getFxMacdInfo(p_period, p_cno);
	else 
		select 0 as type;
	end if; 
END;

-- 030 如果区间最小值不低于前底，返回1：反之返回：0
DROP PROCEDURE IF EXISTS zsy_checkBreakMin;
create procedure zsy_checkBreakMin(IN p_period int,in p_bin_cno int, in p_end_cno int)  
BEGIN 
	declare v_min decimal(10,4) DEFAULT 0;
	declare v_bot decimal(10,4) DEFAULT 0;
	
	if p_period = 5 then
		select min(low) into v_min from t_candle_05 where cno >= p_bin_cno and cno <= p_end_cno;
		select low into v_bot from t_candle_05 where cno = (select max(cno) from t_topbtm where del = 0 and topbtm = -1 and period = p_period and cno <= p_end_cno);
	elseif  p_period = 10 then
		select min(low) into v_min from t_candle_10 where cno >= p_bin_cno and cno <= p_end_cno;
		select low into v_bot from t_candle_10 where cno = (select max(cno) from t_topbtm where del = 0 and topbtm = -1 and period = p_period and cno <= p_end_cno);
	elseif  p_period = 30 then
		select min(low) into v_min from t_candle_30 where cno >= p_bin_cno and cno <= p_end_cno;
		select low into v_bot from t_candle_30 where cno = (select max(cno) from t_topbtm where del = 0 and topbtm = -1 and period = p_period and cno <= p_end_cno);
	end if;

	select if(v_bot <= v_min,1,0) as num;
END ;

-- 031 如果区间最小值不高于前顶，返回1：反之返回：0
DROP PROCEDURE IF EXISTS zsy_checkBreakMax;
create procedure zsy_checkBreakMax(IN p_period int,in p_bin_cno int, in p_end_cno int)  
BEGIN 
	declare v_max decimal(10,4) DEFAULT 0;
	declare v_top decimal(10,4) DEFAULT 0;
	
	if p_period = 5 then
		select max(high) into v_max from t_candle_05 where cno >= p_bin_cno and cno <= p_end_cno;
		select high into v_top from t_candle_05 where cno = (select max(cno) from t_topbtm where del = 0 and topbtm = 1 and period = p_period and cno <= p_end_cno);
	elseif  p_period = 10 then
		select max(high) into v_max from t_candle_10 where cno >= p_bin_cno and cno <= p_end_cno;
		select high into v_top from t_candle_10 where cno = (select max(cno) from t_topbtm where del = 0 and topbtm = 1 and period = p_period and cno <= p_end_cno);
	elseif  p_period = 30 then
		select max(high) into v_max from t_candle_30 where cno >= p_bin_cno and cno <= p_end_cno;
		select high into v_top from t_candle_30 where cno = (select max(cno) from t_topbtm where del = 0 and topbtm = 1 and period = p_period and cno <= p_end_cno);
	end if;

	select if(v_top >= v_max,1,0) as num;
END ;

-- 032 添加form数据
DROP PROCEDURE IF EXISTS zsy_addForm;
create procedure zsy_addForm(IN p_period int,in p_cno int, IN p_dir int)  
BEGIN 
	insert into t_form (period, cno, topbtm, border) values(p_period, p_cno, p_dir, 0);
END ;

-- 033 添加到 candel表
DROP PROCEDURE IF EXISTS zsy_addCandleByTab;
create procedure zsy_addCandleByTab(IN p_table VARCHAR(20),in p_cno int(5),in p_time bigint(14), in p_open decimal(10,5), IN p_close decimal(10,5), in p_high decimal(10,5), IN p_low decimal(10,5)) 
BEGIN 
	SET @sql = concat('insert into ', p_table, '(cno, time, open, close, high, low) values(', p_cno, ',', p_time, ',', p_open, ',', p_close,',', p_high,',', p_low, ')');
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 034 前端显示数据
DROP PROCEDURE IF EXISTS zsy_getCandlsByPeriod;
CREATE PROCEDURE zsy_getCandlsByPeriod(IN p_table VARCHAR(20),IN p_direction int,IN p_period int,IN p_size int,IN p_time bigint(14))
BEGIN
	SET @sql = concat('select t1.cno, t1.time, t1.open, t1.close, t1.high, t1.low, t2.k, t2.d 
						from ', p_table, ' t1 
						left JOIN t_kd t2 on t1.cno = t2.cno and t2.period = ', p_period);

	if p_direction = 1 THEN
		 	set @sql = concat(@sql, ' where t1.time > ', p_time, ' order by t1.time asc limit ', p_size);
	elseif p_direction = -1 THEN
			set @sql = concat(@sql, ' where t1.time < ', p_time, ' order by t1.time desc limit ', p_size);
	END IF;
	
	PREPARE stmt FROM @sql;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END;

-- 背离突破数据
DROP PROCEDURE IF EXISTS zsy_getBrkDevInfo;
CREATE PROCEDURE zsy_getBrkDevInfo(IN p_period int, IN p_bin bigint(14), IN p_end bigint(14))
BEGIN
		select t.time, if( instr( GROUP_CONCAT(distinct t.updn),',' ) > 0 ,3, GROUP_CONCAT(distinct t.updn)) as updn, if( instr( GROUP_CONCAT(distinct t.type),',' ) > 0 ,3, GROUP_CONCAT(distinct t.type)) as type, GROUP_CONCAT(t.name) as name from
	(
		select time, updn , (case updn when -1 then 'dev_dn' when 1 then 'dev_up' end) as name, 0 as type from t_deviate 
		where period = p_period and time >= p_bin and time <= p_end

		union all

		select time, updn , (case updn when -1 then 'brk_dn' when 1 then 'brk_up' end) as name, 1 as type from t_break 
		where period = p_period and time >= p_bin and time <= p_end
	) t 
	GROUP BY t.time ;
END;
//
delimiter ;