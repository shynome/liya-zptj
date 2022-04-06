_exit:
	exit 0
sync:
	rsync --delete-delay --exclude=v1/ -avzP ./build/ shy-drone:/work/www/ly/zptj
export:
	yarn build
