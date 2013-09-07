
zip:
	git archive HEAD -o yuehu.zip --prefix=yuehu/

cn = _locales/zh_CN/messages.json
tw = _locales/zh_TW/messages.json
locale:
	opencc -i ${cn} -o ${tw} -c zhs2zhtw_vp.ini

.PHONY: zip
