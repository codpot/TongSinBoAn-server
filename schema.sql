/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE TABLE IF NOT EXISTS `group` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_idx` int(11) NOT NULL,
  PRIMARY KEY (`idx`),
  KEY `FK_group_member` (`admin_idx`),
  CONSTRAINT `FK_group_member` FOREIGN KEY (`admin_idx`) REFERENCES `member` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `log` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int(11) NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `regdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idx`),
  KEY `FK_log_member` (`member_idx`),
  CONSTRAINT `FK_log_member` FOREIGN KEY (`member_idx`) REFERENCES `member` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `member` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwd` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_idx` int(11) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT '0',
  `profile_img` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_valid` datetime DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `regdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idx`),
  UNIQUE KEY `userid` (`userid`),
  KEY `FK_member_group` (`group_idx`),
  CONSTRAINT `FK_member_group` FOREIGN KEY (`group_idx`) REFERENCES `group` (`idx`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `policy` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `group_idx` int(11) NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `mdm` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idx`),
  KEY `FK_policy_group` (`group_idx`),
  CONSTRAINT `FK_policy_group` FOREIGN KEY (`group_idx`) REFERENCES `group` (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `policy_admin` (
  `policy_idx` int(11) NOT NULL,
  `member_idx` int(11) NOT NULL,
  `chgdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`policy_idx`,`member_idx`),
  KEY `FK_policy_admin_member` (`member_idx`),
  CONSTRAINT `FK_policy_admin_member` FOREIGN KEY (`member_idx`) REFERENCES `member` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_policy_admin_policy` FOREIGN KEY (`policy_idx`) REFERENCES `policy` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `policy_user` (
  `policy_idx` int(11) NOT NULL,
  `member_idx` int(11) NOT NULL,
  `chgdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`policy_idx`,`member_idx`),
  KEY `FK_policy_user_member` (`member_idx`),
  CONSTRAINT `FK_policy_user_member` FOREIGN KEY (`member_idx`) REFERENCES `member` (`idx`),
  CONSTRAINT `FK_policy_user_policy` FOREIGN KEY (`policy_idx`) REFERENCES `policy` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
