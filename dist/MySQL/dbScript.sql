CREATE TABLE `chat_moha` (
  `ID` int(11) NOT NULL auto_increment,
  `time` bigint(12) default NULL,
  `message` longtext,
  `from` varchar(30) NOT NULL,
  `to` varchar(30) NOT NULL default 'moha',
  `checked` int(1) NOT NULL default '0',
  `postedTime` bigint(12) NOT NULL,
  `flash` smallint(1) NOT NULL,
  PRIMARY KEY  (`ID`),
  KEY `time` (`time`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE `chat_moha_archive` (
  `ID` int(11) NOT NULL,
  `time` bigint(12) NOT NULL,
  `message` longtext NOT NULL,
  `from` varchar(30) NOT NULL,
  `to` varchar(30) NOT NULL,
  `checked` int(1) NOT NULL,
  `postedTime` bigint(12) NOT NULL,
  `flash` smallint(1) NOT NULL
) ENGINE=ARCHIVE DEFAULT CHARSET=utf8;


CREATE TABLE `chat_moha_buddy` (
  `UID` varchar(50) NOT NULL,
  `BID` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL default '0',
  `cust_status` int(1) NOT NULL default '0',
  `cust_status_message` varchar(18) default NULL,
  PRIMARY KEY  (`UID`,`BID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `chat_moha_file_hist` (
  `id` int(11) NOT NULL,
  `content` mediumblob NOT NULL,
  `part` int(11) NOT NULL
) ENGINE=ARCHIVE DEFAULT CHARSET=utf8;


CREATE TABLE `chat_moha_file_up` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(50) NOT NULL,
  `mime` varchar(30) NOT NULL,
  `size` int(11) NOT NULL,
  `from` varchar(30) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE `chat_moha_poll` (
  `UID` varchar(50) NOT NULL,
  `time` bigint(12) NOT NULL,
  `cust_status` int(1) NOT NULL default '0',
  `cust_status_message` text,
  PRIMARY KEY  (`UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `chat_moha_users` (
  `UID` varchar(30) NOT NULL,
  `PW` varchar(32) NOT NULL,
  PRIMARY KEY  (`UID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
