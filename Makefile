_exit:
	exit 0
sync:
	rsync --delete-delay --exclude=v1/ -avzP ./build/ shy-coal:/usr/share/ly/zptj
export:
	yarn build
