Набор инструментов для использования в приложениях

## Установка
```shell
$ npm install javascript-toolbox
```

## Использование в браузере

Необходимо сделать serve для запросов к папке `/javascript-toolbox -> ./node_modules/javascript-toolbox`

```html
<script type="importmap">
{
  "imports": {
    "javascript-toolbox": "/javascript-toolbox/index.js"
  }
}
</script>
```

```javascript
import { UUID, Deferred, Locator, Screen, ... } 'javascript-toolbox';
...
```
---

## Классы
### `UUID`
```javascript
import UUID from 'javascript-toolbox/library/UUID.js';
```
* `new UUID(value: string)` - создает UUID из переданной строки
* `UUID.zero()` - создает UUID из нулей
* `UUID.random(), new UUID()` - создает случайный UUID
* `UUID.valudate(value: UUID | string)` - проверяет на корректность записи
* `UUID.is(uuid: any): boolean` - instanceof UUID
* `UUID.value` - readonly:string - значение
* `UUID.compare(uuid: UUID): boolean`

### `Deferred` - отложенный объект
> `Promise-like` объект, способный резолвиться извне
```javascript
import Deferred from 'javascript-toolbox/library/Deferred.js';

const promise = new Deferred();
promise.resolve();
promise.reject();
```

### `Locator`
> Базовый класс для реализации `DI` паттерна `ServiceLocator`

locator.js
```javascript
import Locator from 'javascript-toolbox/library/Locator.js';

export class AppLocator extends Locator {
  get service1() {
    return this.get('service1');
  }

  get service2() {
    return this.get('service2');
  }

  get service3() {
    return this.get('service3');
  }
}

const locator = new AppLocator();
export default locator;
```

index.js
```javascript
import locator from './locator.js';

locator.services = { service1, service2 };
locator.set('service3', service3);
```

### Screen - класс для получения инфы и работы с экраном юзера `@browser`
```javascript
import Screen from 'javascript-toolbox/library/Scren.js'

const root = documemnt.body;
const screen = new Screen(root);

screen.observe(node, onResize); // onResize.call(node, screen);
screen.unObserve(node, onResize1, onResize2, ...);

screen.onResize(callback); // callback.call(root, screen);
screen.offResize(callback1, callback2, callback3, ...);

screen.width  // number
screen.height // number
screen.size   // javascript-algebra/Vector
screen.center // javascript-algebra/Vector

Screen.pointer(mouseEvent) // javascript-algebra/Vector
Screen.animation(render) // requestAnimationFrame
```

### Gestures - работа с жестами (тачпад)
```javascript
new Gestures(element)
  .start(_ => ({ scale, rotation })) // стартовые значения (position?)
  .translate(({ difference }) => scene.move(difference))
  .scale(({ scale }) => scene.scale(scale))
  .rotate(({ rotation }) => scene.rotate(rotation));
```

### Context-Store API
```javascript

const context = new Context("name", { data: 0 }, (initState) => { data: initState.data + 1 });

context.dispatch({ data: 2 })

context.on(() => {
  context.select(store => store.data); // 2
});
```
