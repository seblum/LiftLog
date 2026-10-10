CREATE TABLE `folder_sync_baseline` (
	`folderUri` text NOT NULL,
	`path` text NOT NULL,
	`payload` text NOT NULL,
	PRIMARY KEY(`folderUri`, `path`)
);
