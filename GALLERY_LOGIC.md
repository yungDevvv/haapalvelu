# 📸 Логика работы галереи - ФИНАЛЬНАЯ ВЕРСИЯ

## ✅ Два типа галерей

### 1️⃣ **По ссылке** (default)
```
✅ Доступна ТОЛЬКО по прямой ссылке: /galleria?id=123
❌ НЕ показывается в публичном списке
❌ Пароль НЕ требуется
```

### 2️⃣ **По ссылке + пароль** (`isPasswordProtected: true`)
```
✅ Доступна ТОЛЬКО по прямой ссылке: /galleria?id=123
❌ НЕ показывается в публичном списке
🔒 Требует пароль для просмотра
```

## 🎯 Общая концепция

### Типы пользователей и их UI:

#### 👰🤵 **Hääpari** (Свадебная пара) - Полная версия
```
ВИДЯТ:
✅ Все галереи (публичные, защищенные, приватные)
✅ Кнопки: "Uusi galleria", "Muokkaa", "Poista"
✅ Раздел "Vieraiden kuvat" - одобрение загруженных фото
✅ Массовое редактирование "Valitse useita"
✅ Статистика: просмотры, загрузки
✅ Настройки защиты для каждой галереи
✅ Кнопки загрузки нескольких фото
✅ Все CRUD операции

UI ЭЛЕМЕНТЫ:
- Верхняя панель с кнопками управления
- Dropdown меню на каждой галерее
- Секция "Ожидают одобрения" с фото от гостей
- Настройки безопасности
- Экспорт/импорт галерей
```

#### 👥 **Vieras** (Гость) - Упрощенная версия
```
ВИДЯТ:
✅ Только публичные галереи
✅ Защищенные галереи (после ввода пароля)
✅ Кнопка "Lähetä kuvia" - загрузить фото
✅ Lightbox для просмотра
✅ Кнопка "Lataa" - скачать фото

НЕ ВИДЯТ:
❌ Приватные галереи
❌ Кнопки редактирования/удаления
❌ Настройки галерей
❌ Фото от других гостей до одобрения
❌ Статистику и аналитику
❌ Dropdown меню с опциями

UI ЭЛЕМЕНТЫ:
- Только просмотр и загрузка
- Чистый интерфейс без кнопок управления
- Большие красивые фото
- Простая навигация
```

---

## 🎨 Разделение UI компонентов

### Вариант А: Условный рендеринг в одном компоненте
```javascript
export function PhotoGallery({ galleries, userRole }) {
  return (
    <div>
      {/* Показываем только для Hääpari */}
      {userRole === 'haapari' && (
        <div className="admin-controls">
          <Button>Uusi galleria</Button>
          <Button>Valitse useita</Button>
          <GuestPhotosSection />
        </div>
      )}
      
      {/* Общее для всех */}
      <GalleriesGrid 
        galleries={filteredGalleries} 
        showControls={userRole === 'haapari'}
      />
    </div>
  );
}
```

### Вариант Б: Отдельные компоненты (рекомендуется) ⭐
```
src/components/
├── photo-gallery/
│   ├── admin/
│   │   ├── PhotoGalleryAdmin.jsx      // Для Hääpari
│   │   ├── GalleryManager.jsx         // CRUD галерей
│   │   ├── GuestPhotosReview.jsx      // Одобрение фото
│   │   └── BulkEditModal.jsx          // Массовое редактирование
│   │
│   ├── guest/
│   │   ├── PhotoGalleryGuest.jsx      // Для Vieras
│   │   ├── GalleryViewer.jsx          // Просмотр галерей
│   │   └── PhotoUploadModal.jsx       // Загрузка фото
│   │
│   └── shared/
│       ├── PhotoLightbox.jsx          // Общий lightbox
│       ├── GalleryCard.jsx            // Карточка галереи
│       └── PasswordModal.jsx          // Ввод пароля
```

### Вариант В: Роутинг (самый чистый) ⭐⭐⭐
```
/kuvagalleria              → Общий вход
  ├── /admin               → Только Hääpari
  │   ├── /hallinta        → Управление галереями
  │   ├── /vieraiden-kuvat → Одобрение фото гостей
  │   └── /asetukset       → Настройки
  │
  └── /galleria            → Для всех (Vieras)
      ├── /public          → Публичные галереи
      └── /protected       → Защищенные (с паролем)
```

---

## 🛠️ Практическая реализация (рекомендуемый подход)

### Используем существующий UserContext

У тебя уже есть система ролей! Давай используем её:

```javascript
// В page.js уже есть UserContext
import { useUser } from '@/contexts/user-context';

export function PhotoGallery({ galleries }) {
  const { user } = useUser();
  const isAdmin = user.role === 'haapari';
  
  return (
    <div>
      {/* Показываем разные версии в зависимости от роли */}
      {isAdmin ? (
        <PhotoGalleryAdmin galleries={galleries} />
      ) : (
        <PhotoGalleryGuest galleries={galleries} />
      )}
    </div>
  );
}
```

### Минимальные изменения для разделения

**Шаг 1:** Оборачиваем кнопки управления в PermissionGuard
```javascript
import { PermissionGuard } from '@/contexts/user-context';

// В шапке галереи
<PermissionGuard permission="managePhotos">
  <Button>Uusi galleria</Button>
  <Button>Valitse useita</Button>
</PermissionGuard>

// Кнопка для гостей видна всегда
<Button>Lähetä kuvia</Button>
```

**Шаг 2:** Фильтруем галереи по роли
```javascript
const visibleGalleries = galleries.filter(gallery => {
  // Hääpari видит всё
  if (isAdmin) return true;
  
  // Vieras видит только публичные и защищенные
  return gallery.isPublic || gallery.isPasswordProtected;
});
```

**Шаг 3:** Условно показываем элементы управления
```javascript
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    {isAdmin && (
      <Button variant="ghost" size="sm">
        <MoreVertical className="h-4 w-4" />
      </Button>
    )}
  </DropdownMenuTrigger>
  {/* ... опции редактирования ... */}
</DropdownMenu>
```

### Структура файлов (простой вариант)

```
src/components/
├── photo-gallery.jsx           // Главный с проверкой роли
├── photo-gallery-admin.jsx     // Версия для Hääpari (новый)
├── photo-gallery-guest.jsx     // Версия для Vieras (новый)
└── shared/
    ├── gallery-card.jsx        // Карточка (общая)
    ├── photo-lightbox.jsx      // Lightbox (общий)
    └── password-modal.jsx      // Модалка пароля (новая)
```

### Пример PhotoGalleryGuest.jsx (упрощенная версия)

```javascript
"use client";

export function PhotoGalleryGuest({ galleries }) {
  // Показываем только публичные и защищенные галереи
  const publicGalleries = galleries.filter(g => 
    g.isPublic || g.isPasswordProtected
  );
  
  return (
    <div className="space-y-6">
      {/* Простой заголовок без кнопок управления */}
      <div>
        <h2 className="text-3xl font-bold">Kuvagalleria</h2>
        <p className="text-muted-foreground">
          {totalPhotos} kuvaa hääjuhlista
        </p>
      </div>
      
      {/* Только кнопка загрузки для гостей */}
      <Button>
        <Smartphone className="h-4 w-4 mr-2" />
        Lähetä kuvia
      </Button>
      
      {/* Сетка галерей БЕЗ dropdown меню */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publicGalleries.map(gallery => (
          <GalleryCard 
            key={gallery.id}
            gallery={gallery}
            showControls={false}  // Убираем управление
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔐 Система защиты галерей

### Вариант 1: Индивидуальная защита каждой галереи
```
Каждая галерея может иметь:
- Свой пароль (isPasswordProtected: true, password: "abc123")
- Защиту от копирования (disableCopyProtection: true)
- Публичный/приватный статус (isPublic: true/false)
```

**Как работает:**
```javascript
// При открытии галереи
if (gallery.isPasswordProtected) {
  // Показать модальное окно с вводом пароля
  // Проверить пароль
  if (inputPassword === gallery.password) {
    // Разрешить доступ
    // Сохранить в sessionStorage что пользователь ввел пароль
    sessionStorage.setItem(`gallery_${gallery.id}_unlocked`, 'true');
  } else {
    // Показать ошибку
    alert("Неверный пароль");
  }
}
```

### Вариант 2: Единая система доступа (рекомендуется)
```
Все галереи делятся на:
1. Публичные - доступны всем
2. Защищенные общим паролем - один пароль для всех защищенных галерей
3. Приватные - только для Hääpari
```

**Преимущества:**
- Проще для гостей (не нужно помнить 10 паролей)
- Один пароль можно дать всем гостям на свадьбе
- Hääpari может иметь приватные галереи только для себя

---

## 📂 Структура данных галереи

```javascript
const gallery = {
  id: 1,
  title: "Hääkuvat 2024",
  description: "Kauneimmat hetket hääpäivästämme",
  category: "haakuvat",
  date: "2024-07-15",
  
  // Защита
  isPasswordProtected: true,    // Нужен ли пароль
  password: "häät2024",          // Сам пароль
  isPublic: true,                // Публичная или приватная
  disableCopyProtection: true,   // Запрет на копирование
  
  // Настройки загрузки
  allowGuestUploads: true,       // Могут ли гости загружать фото
  
  // Данные
  photos: [...],                 // Фотографии от Hääpari
  guestPhotos: [...],            // Фотографии от гостей (ждут одобрения)
  
  // Метаданные
  createdAt: "2024-01-15",
  createdBy: "Anna Virtanen",
  viewCount: 1250,
  downloadCount: 45
}
```

---

## 🎨 Сценарии использования

### Сценарий 1: Создание галереи

```
1. Hääpari нажимает "Uusi galleria"
2. Заполняет форму:
   - Название
   - Описание (опционально)
   - Категория
   - Дата
3. Настройки безопасности:
   ✓ Включить защиту паролем? [checkbox]
   → Если да: ввести пароль
   ✓ Включить защиту от копирования? [checkbox]
4. Дополнительно:
   ✓ Разрешить гостям загружать фото? [checkbox]
5. Нажимает "Luo galleria"
```

### Сценарий 2: Гость открывает защищенную галерею

```
1. Гость видит галерею с иконкой 🔒
2. Кликает на галерею
3. Система проверяет:
   - Есть ли пароль в sessionStorage?
   - Если НЕТ → показать модалку с вводом пароля
   - Если ДА → открыть галерею
4. После правильного ввода пароля:
   - Сохранить в sessionStorage
   - Открыть галерею
   - Пароль действует до закрытия браузера
```

### Сценарий 3: Гость загружает фото

```
1. Гость нажимает "Lähetä kuvia"
2. Заполняет форму:
   - Выбирает галерею (только те где allowGuestUploads: true)
   - Вводит имя
   - Email (опционально)
   - Подпись к фото
   - Выбирает файлы
3. Фото загружаются в gallery.guestPhotos[]
4. Hääpari получает уведомление (email + внутреннее)
5. Hääpari может:
   - Одобрить фото → переместить в gallery.photos[]
   - Удалить фото
   - Редактировать подпись
```

### Сценарий 4: Массовое редактирование

```
1. Hääpari нажимает "Valitse useita"
2. Включается режим выбора (selectionMode: true)
3. Кликает на фото → добавляются в selectedPhotos[]
4. Нажимает "Muokkaa (5)" → открывается форма:
   - Изменить фотографа для всех выбранных
   - Добавить теги
   - Изменить подпись
5. Применить изменения ко всем выбранным фото
```

---

## 🔄 Рекомендуемая структура компонентов

```
photo-gallery.jsx (главный)
├── GalleryCard - карточка галереи
├── GalleryPasswordModal - ввод пароля
├── GuestUploadModal - загрузка от гостей
├── BulkEditModal - массовое редактирование
├── PhotoLightbox - просмотр фото
└── GuestPhotosReview - одобрение фото гостей
```

---

## 🎯 Рекомендации по реализации

### 1. Защита паролем - упрощенный подход

```javascript
// Один общий пароль для всех защищенных галерей
const WEDDING_PASSWORD = "häät2024";

// При клике на защищенную галерею
const handleGalleryClick = (gallery) => {
  if (gallery.isPasswordProtected) {
    const isUnlocked = sessionStorage.getItem('wedding_galleries_unlocked');
    
    if (!isUnlocked) {
      setPasswordModalOpen(true);
      setPendingGallery(gallery);
    } else {
      openGallery(gallery);
    }
  } else {
    openGallery(gallery);
  }
};

// При вводе пароля
const handlePasswordSubmit = (password) => {
  if (password === WEDDING_PASSWORD) {
    sessionStorage.setItem('wedding_galleries_unlocked', 'true');
    openGallery(pendingGallery);
    setPasswordModalOpen(false);
  } else {
    alert("Väärä salasana");
  }
};
```

### 2. Категории галерей

```javascript
// Рекомендуемые категории
const galleryCategories = {
  // Публичные - без пароля
  public: {
    polttarit: "Polttarit",
    valmistelut: "Valmistelut"
  },
  
  // Защищенные - общий пароль
  protected: {
    haakuvat: "Hääkuvat",
    juhlat: "Juhlat"
  },
  
  // Приватные - только Hääpari
  private: {
    hamatka: "Häämatkakuvat",
    intimate: "Intiimit hetket"
  }
};
```

### 3. Уведомления о новых фото

```javascript
// При загрузке фото гостем
const handleGuestPhotoUpload = (guestPhoto) => {
  // 1. Добавить в базу
  addToGuestPhotos(guestPhoto);
  
  // 2. Создать уведомление
  const notification = {
    id: Date.now(),
    type: 'guest_photo',
    message: `${guestPhoto.uploaderName} lähetti uuden kuvan`,
    galleryId: guestPhoto.galleryId,
    timestamp: new Date(),
    read: false
  };
  
  // 3. Показать badge на иконке колокольчика
  setUnreadNotifications(prev => prev + 1);
  
  // 4. Отправить email (если включено)
  // sendEmailNotification(...)
};
```

---

## 💡 Предлагаемая реализация для вашего случая

### Простой и понятный подход:

1. **Три уровня доступа:**
   - 🌍 Публичные галереи (без пароля)
   - 🔒 Защищенные галереи (один общий пароль)
   - 👑 Приватные галереи (только Hääpari)

2. **Загрузка гостями:**
   - Гости могут загружать в любые галереи где allowGuestUploads: true
   - Фото попадают в раздел "Ожидают одобрения"
   - Hääpari одобряет/удаляет их

3. **Защита:**
   - Один пароль для всех защищенных галерей
   - Пароль сохраняется в sessionStorage (действует до закрытия браузера)
   - Иконка 🔒 показывает что нужен пароль

4. **Копирование:**
   - CSS: `user-select: none; pointer-events: none` на правый клик
   - JavaScript: preventDefault на контекстное меню
   - Watermark на изображениях (опционально)

---

## 🚀 Что делать дальше?

Я могу реализовать:

1. ✅ **Модальное окно ввода пароля** - простое и красивое
2. ✅ **Логику проверки пароля** - с сохранением в sessionStorage
3. ✅ **Раздел "Фото от гостей"** - для одобрения загруженных фото
4. ✅ **Защиту от копирования** - CSS + JS события
5. ✅ **Массовое редактирование** - выбор и редактирование нескольких фото

Какой вариант защиты тебе больше нравится - один общий пароль или индивидуальные пароли для каждой галереи?
