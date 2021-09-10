# [YouTube-video search App](https://serj-l.github.io/YouTube-search-app)
#### _Приложение для поиска youtube-видео по ключевым словам, сохранения и редактирования поисковых запросов_
Интерфейс приложения:
- форма для регистрации/входа в приложение;
- главная страница, на которой осуществляется поиск youtube-видео и отображение результатов поиска;
- страница с сохраненными поисковыми запросами;

### Регистрация/вход
Регистрация и авторизация пользователей реализована с использованием сервиса Firebase Authentication. Для регистрации нового пользователя необходимо заполнить поля `Логин` (в качестве логина используетя Email) и `Пароль` (не менее 6-ти символов), активировать переключатель под надписью "Регистрация нового пользователя и вход" и нажать кнопку `Регистрация`. После успешной регистрации пользователь будет автоматически перенаправлен на главную страницу приложения -- страницу поиска. Вход в приложение осуществляется по `Логину` и `Паролю`, которые были указаны пользователем при регистрации. Для неавторизованного пользователя доступна только страница с формой регистрации/авторизации.

### Поиск youtube-видео
После регистрации/авторизации пользователь попадает на страницу поиска видео. Поиск осуществлется посредством использования YouTube API. Результаты поиска выводятся на эту же страницу. По умолчанию результаты поиска выводятся в виде списка 12 видео (количество отображаемых видео можно изменить при сохранении запроса в раздел "Избранное", а также после его сохранения). Также предусмотрена возможность отображения результатов поиска в виде карточек. Переключение режимов отображения осуществляется при помощи соотвествующих иконок, расположенных под строкой поиска.

### Сохранение поисковых запросов
Для сохранения поискового запроса необходимо нажать на иконку 🤍 , расположенную в конце строки поиска.
После нажатия на иконку откроется соотвествующая `форма "Сохранить запрос"` со следующими полями:
- "Запрос" -- отображается текст запроса (поле недоступно для редактирования);
- "Название" -- вводится пользовательское название поискового запроса (поле обязательно для заполнения);
- "Сортировать по" -- определяется порядок сортировки видео в результате поиска;
- "Максимальное количество" -- определяется максимальное количество видео, отображаемых в результате поиска.
Для сохранения поискового запроса в разделе "Избранное" необходимо нажать кнопку `Сохранить`.

После сохранения запроса иконка окрасится в синий цвет 💙. Если после ввода поискового запроса иконка синего цвета 💙, запрос уже был ранее сохранен в разделе "Избранное".

### Раздел "Избранное"
На данной странице отображаются поисковые запросы, ранее сохраненные пользователем. Все сохраненные пользователем запросы хранятся в облачном хранилище Firebase (для каждого пользователя отображаются его поисковые запросы).
Переход `в раздел "Избранное"` осуществляется через навигационное меню (`пункт меню Избранное`) либо `нажатием на иконку 💙` в строке поиска, либо по ссылке `Перейти в "Избранное"` во всплывающем сообщении, которое появяется при наведении курсора мышки на иконку 💙.

_В разделее "Избранное" предусмотрены следующие возможности:_
- `выполнить запрос`, нажав на название запроса, при этом откроется модальное окно с параметрами запроса, что бы выполнить запрос необходимо нажать кнопку "Выполнить";
- `изменить запрос`, необходимо нажать "Изменить", после чего откроется форма для редактирования параметров запроса (поля формы аналогичны форме для сохранения запроса), в которой для редактирования доступны все поля, при этом обязательными для заполнения являюся: "Запрос" и "Название". Для преотвращения появления дубликатов запросов (одинаковые ключевые слова) предусмотрен соответствующий контроль (осуществляется по полю "Запрос");
- `удалить запрос`, необходимо нажать "Удалить", откроется модальное окно для подтверждения или отмены операции удаления запроса.

### Выход из приложения
Осуществляется через навигационное меню -- `пункт меню Выйти`

[Ссылка на макет](https://tinyurl.com/y2qshhbg)

## License

MIT

**✨ Free Software ✨**
