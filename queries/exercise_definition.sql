DROP TABLE IF EXISTS `exercises`;

CREATE TABLE `exercises` (
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`reps` int,
	`weight` int,
	`date` date,
	`unit` varchar(16),
	PRIMARY KEY (`id`),
	UNIQUE (`name`)
) ENGINE=InnoDB;