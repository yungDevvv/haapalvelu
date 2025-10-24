# 🎨 Анимации в проекте - Краткая инструкция

## ✅ Что сделано

### 1. 🎯 Улучшенные Tabs
Tabs теперь выглядят как на вашем изображении:
- ✨ Красивый белый фон с прозрачностью
- 🌈 Градиентный фон для активной вкладки (розовый → фиолетовый)
- 💫 Плавная анимация переключения
- 🎯 Занимают всю ширину контейнера
- ✨ Тени и скругленные углы

### 2. 🎬 Framer Motion установлен
```bash
npm install framer-motion
```

### 3. 📦 Готовые анимации
Создан файл `src/lib/animations.js` с готовыми анимациями, которые можно использовать везде.

### 4. 🎨 Анимации добавлены
- Header с анимацией появления
- Карточки на главной странице
- Плавные переходы между вкладками
- Hover эффекты

## 🚀 Как использовать анимации

### Простой пример
```javascript
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

<motion.div {...fadeInUp}>
  Контент появится с анимацией снизу вверх
</motion.div>
```

### Анимация списка карточек
```javascript
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

<motion.div 
  className="grid grid-cols-3 gap-4"
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map(item => (
    <motion.div 
      key={item.id}
      variants={staggerItem}
      whileHover={hoverLift}
    >
      <Card>{item.content}</Card>
    </motion.div>
  ))}
</motion.div>
```

### Hover эффект
```javascript
import { motion } from "framer-motion";

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Нажми меня
</motion.button>
```

## 📚 Доступные анимации

### Базовые
- `fadeIn` - плавное появление
- `fadeInUp` - появление снизу
- `fadeInDown` - появление сверху
- `scaleIn` - увеличение
- `slideInLeft` - появление слева
- `slideInRight` - появление справа

### Для списков
- `staggerContainer` - контейнер для списка
- `staggerItem` - элемент списка (появляются по очереди)

### Hover эффекты
- `hoverScale` - увеличение при наведении
- `hoverLift` - поднятие при наведении

### Tap эффекты
- `tapScale` - уменьшение при нажатии

## 🎯 Где посмотреть примеры

1. **Главная страница** (`src/app/page.js`):
   - Анимированный header
   - Карточки с stagger анимацией
   - Hover эффекты

2. **Tabs** (`src/components/ui/tabs.jsx`):
   - Плавное переключение вкладок
   - Градиентный фон с анимацией

3. **Файл анимаций** (`src/lib/animations.js`):
   - Все готовые анимации с комментариями

## 📖 Полная документация

Смотрите файлы:
- `ANIMATIONS_GUIDE.md` - подробное руководство на английском
- `CHANGELOG.md` - список всех изменений

## 🎨 Цвета проекта

- **Розовый**: `#ec4899` (pink-500)
- **Фиолетовый**: `#a855f7` (purple-500)
- **Градиент**: `from-pink-500 to-purple-500`

## 💡 Советы

1. ✅ Используйте готовые анимации из `animations.js`
2. ✅ Не добавляйте слишком много анимаций - это замедлит приложение
3. ✅ Тестируйте на разных устройствах
4. ✅ Для плавных переходов используйте `layoutId`
5. ✅ Добавляйте анимации к важным элементам (кнопки, карточки, модальные окна)

## 🚀 Запуск проекта

```bash
npm run dev
```

Откройте http://localhost:3000 и наслаждайтесь анимациями! 🎉

## ❓ Вопросы?

Все примеры использования есть в файлах:
- `src/app/page.js` - главная страница
- `src/components/ui/tabs.jsx` - компонент tabs
- `ANIMATIONS_GUIDE.md` - полное руководство
