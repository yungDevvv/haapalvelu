# 🎨 Руководство по анимациям в проекте

## 📦 Установленные библиотеки

- **Framer Motion** - современная библиотека для анимаций в React

## 🎯 Готовые анимации

Все готовые анимации находятся в файле `src/lib/animations.js`

### Базовые анимации

#### fadeIn
```javascript
import { fadeIn } from "@/lib/animations";

<motion.div {...fadeIn}>
  Контент
</motion.div>
```

#### fadeInUp
```javascript
import { fadeInUp } from "@/lib/animations";

<motion.div {...fadeInUp}>
  Контент появляется снизу вверх
</motion.div>
```

#### fadeInDown
```javascript
import { fadeInDown } from "@/lib/animations";

<motion.div {...fadeInDown}>
  Контент появляется сверху вниз
</motion.div>
```

#### scaleIn
```javascript
import { scaleIn } from "@/lib/animations";

<motion.div {...scaleIn}>
  Контент увеличивается при появлении
</motion.div>
```

#### slideInLeft / slideInRight
```javascript
import { slideInLeft, slideInRight } from "@/lib/animations";

<motion.div {...slideInLeft}>
  Контент появляется слева
</motion.div>

<motion.div {...slideInRight}>
  Контент появляется справа
</motion.div>
```

### Анимации для списков (Stagger)

```javascript
import { staggerContainer, staggerItem } from "@/lib/animations";

<motion.div 
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  <motion.div variants={staggerItem}>Элемент 1</motion.div>
  <motion.div variants={staggerItem}>Элемент 2</motion.div>
  <motion.div variants={staggerItem}>Элемент 3</motion.div>
</motion.div>
```

### Hover анимации

```javascript
import { hoverScale, hoverLift } from "@/lib/animations";

<motion.div whileHover={hoverScale}>
  Увеличивается при наведении
</motion.div>

<motion.div whileHover={hoverLift}>
  Поднимается при наведении
</motion.div>
```

### Tap анимации

```javascript
import { tapScale } from "@/lib/animations";

<motion.button whileTap={tapScale}>
  Нажми меня
</motion.button>
```

## 🎨 Улучшенные Tabs

Tabs теперь имеют:
- ✨ Плавную анимацию переключения
- 🎯 Градиентный фон для активной вкладки
- 🌊 Spring анимацию с layoutId
- 💫 Hover эффекты
- 🎭 Backdrop blur эффект

### Использование

```javascript
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">
      <Icon />
      Вкладка 1
    </TabsTrigger>
    <TabsTrigger value="tab2">
      <Icon />
      Вкладка 2
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    Контент автоматически анимируется
  </TabsContent>
  
  <TabsContent value="tab2">
    Контент автоматически анимируется
  </TabsContent>
</Tabs>
```

## 🚀 Примеры использования

### Анимация карточек

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
      <Card>
        {item.content}
      </Card>
    </motion.div>
  ))}
</motion.div>
```

### Анимация модальных окон

```javascript
import { motion } from "framer-motion";
import { scaleIn } from "@/lib/animations";

<motion.div {...scaleIn}>
  <Dialog>
    Контент модального окна
  </Dialog>
</motion.div>
```

### Анимация header

```javascript
import { motion } from "framer-motion";

<motion.header
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  Header контент
</motion.header>
```

### Анимация кнопок

```javascript
import { motion } from "framer-motion";
import { tapScale } from "@/lib/animations";

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={tapScale}
  className="..."
>
  Нажми меня
</motion.button>
```

## 🎯 Лучшие практики

1. **Используйте готовые анимации** из `animations.js` для консистентности
2. **Не переусердствуйте** - слишком много анимаций может замедлить приложение
3. **Используйте layoutId** для плавных переходов между состояниями
4. **Добавляйте анимации к важным элементам** - кнопкам, карточкам, модальным окнам
5. **Тестируйте производительность** на медленных устройствах

## 📚 Дополнительные ресурсы

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [Animation Best Practices](https://web.dev/animations/)

## 🎨 Цветовая схема проекта

- **Primary**: Pink (розовый) - `from-pink-500 to-purple-500`
- **Secondary**: Purple (фиолетовый)
- **Accent**: Blue (синий)
- **Success**: Green (зеленый)
- **Warning**: Yellow (желтый)
- **Error**: Red (красный)

## 💡 Советы

- Используйте `whileHover` и `whileTap` для интерактивных элементов
- Добавляйте `transition={{ duration: 0.3 }}` для контроля скорости
- Используйте `variants` для сложных анимаций
- Применяйте `layoutId` для магических переходов между элементами
