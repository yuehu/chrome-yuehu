
zip:
	@echo "Creating zip file: yuehu.zip"
	@git archive HEAD -o yuehu.zip --prefix=yuehu/

clean:
	@rm yuehu.zip

cn = _locales/zh_CN/messages.json
tw = _locales/zh_TW/messages.json
locale:
	@echo "generate zh_TW messages"
	@opencc -i ${cn} -o ${tw} -c zhs2zhtw_vp.ini

.PHONY: zip locale clean
