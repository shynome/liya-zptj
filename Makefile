_exit:
	exit 0
sync:
	rsync --delete-delay -avzP ./build/ shy-coal:/usr/share/ly/zptj
export:
	yarn build
