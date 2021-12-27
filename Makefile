_exit:
	exit 0
sync:
	rsync --delete-delay -avzP ./out/ shy-coal:/usr/share/ly/zptj/v1
export:
	yarn next build && yarn next export
