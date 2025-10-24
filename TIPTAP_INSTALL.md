# 📦 Установка TipTap Rich Text Editor

Для работы Rich Text Editor нужно установить TipTap пакеты:

```bash
npm install @tiptap/react @tiptap/starter-kit
```

## 📚 Установленные Пакеты

- **@tiptap/react** - React компоненты для TipTap
- **@tiptap/starter-kit** - Базовый набор расширений (Bold, Italic, Headings, Lists и т.д.)

## ✅ Уже Установлено

- ✅ framer-motion (для анимаций блоков)
- ✅ lucide-react (иконки)
- ✅ tailwindcss (стили)

## 🎨 Поддерживаемое Форматирование

### Заголовки
- H1, H2, H3

### Текст
- **Жирный** (Bold)
- *Курсив* (Italic)
- ~~Зачеркнутый~~ (Strikethrough)
- `Код` (Code)

### Списки
- Маркированные списки
- Нумерованные списки

### Другое
- Цитаты (Blockquote)
- Undo/Redo

## 🚀 Использование

Rich Text Editor автоматически используется в текстовых блоках:

1. Добавь Text блок
2. Кликни "Muokkaa"
3. Используй toolbar для форматирования
4. Результат сохраняется как HTML

## 💡 Горячие Клавиши

- **Ctrl + B** - Жирный
- **Ctrl + I** - Курсив
- **Ctrl + Z** - Отменить
- **Ctrl + Shift + Z** - Вернуть

## 📝 Примечания

- HTML сохраняется в поле `content`
- Отображается с Tailwind `prose` классами
- Безопасный рендеринг через `dangerouslySetInnerHTML`
