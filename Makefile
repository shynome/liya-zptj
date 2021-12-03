exit:
	exit 0
sync:
	rsync --delete -avzP ./out/ shy-coal:/usr/share/ly/zptj
