# Деплой на Vercel - Пошаговая инструкция

## Подготовка

1. Убедитесь, что все файлы проекта на месте
2. Установите Git (если еще не установлен)
3. Создайте аккаунт на GitHub (если еще нет)

## Шаг 1: Загрузка на GitHub

```bash
# Инициализируйте Git репозиторий
git init

# Добавьте все файлы
git add .

# Создайте коммит
git commit -m "Initial commit - KiKoGame"

# Создайте репозиторий на GitHub и подключите
git remote add origin https://github.com/ВАШ_USERNAME/kikogame.git
git branch -M main
git push -u origin main
```

## Шаг 2: Подключение к Vercel

1. Зайдите на https://vercel.com
2. Войдите через GitHub
3. Нажмите "Add New Project"
4. Выберите ваш репозиторий `kikogame`
5. Настройки:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (оставьте пустым)
   - **Output Directory**: ./
6. Нажмите "Deploy"

## Шаг 3: Получение ссылки

После деплоя вы получите ссылку вида: `https://kikogame-xxx.vercel.app`

## ⚠️ Важно

**Pygame не будет работать** через Pyodide в браузере. Для работы игры на Vercel нужно:

1. **Использовать Replit** (рекомендуется) - см. README_DEPLOY.md
2. **Переписать на JavaScript** - потребует времени
3. **Использовать Python сервер** - сложная настройка

## Альтернатива: Быстрый деплой через Replit

1. Зайдите на https://replit.com
2. Создайте новый Repl (Python)
3. Загрузите файлы проекта
4. Установите: `pip install pygame`
5. Запустите: `python main.py`
6. Получите публичную ссылку автоматически

Это займет 5 минут и будет работать сразу!

