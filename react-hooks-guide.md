# React Hooks Complete Guide 🎣

## Table of Contents
1. [Basic Hooks](#basic-hooks)
2. [Advanced Hooks](#advanced-hooks)
3. [Performance Hooks](#performance-hooks)
4. [Utility Hooks](#utility-hooks)
5. [New/Experimental Hooks](#newexperimental-hooks)
6. [Memory Tricks Summary](#memory-tricks-summary)

---

## Basic Hooks

### 1. useState
**Memory Trick**: "State starts with S, Simple and Straightforward"

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

**Key Points**:
- Returns array with [value, setter]
- Use functional updates for complex state: `setCount(prev => prev + 1)`
- Initial value can be a function: `useState(() => expensiveComputation())`

### 2. useEffect
**Memory Trick**: "Effect = Side Effect, runs AFTER render"

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Effect runs after every render
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]); // Dependency array
  
  // Cleanup effect
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    return () => clearInterval(timer); // Cleanup
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>Hello, {user?.name}!</div>;
}
```

**Key Points**:
- Empty dependency array `[]` = runs once (componentDidMount)
- No dependency array = runs after every render
- Return function for cleanup (componentWillUnmount)

### 3. useContext
**Memory Trick**: "Context = Share data across Components without props drilling"

```jsx
import React, { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Child component using context
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      style={{ 
        background: theme === 'light' ? 'white' : 'black',
        color: theme === 'light' ? 'black' : 'white'
      }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme
    </button>
  );
}

// App component
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

---

## Advanced Hooks

### 4. useReducer
**Memory Trick**: "Reducer = Redux pattern, for complex state logic"

```jsx
import React, { useReducer } from 'react';

// Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

**When to use**: Complex state logic, multiple sub-values, or when next state depends on previous state.

### 5. useRef
**Memory Trick**: "Ref = Reference, doesn't trigger re-render"

```jsx
import React, { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    inputRef.current.focus();
  });
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <p>Render count: {renderCount.current}</p>
    </div>
  );
}
```

**Key Points**:
- Access DOM elements directly
- Store mutable values that don't trigger re-renders
- `.current` property holds the actual value

---

## Performance Hooks

### 6. useMemo
**Memory Trick**: "Memo = Memoization, cache expensive calculations"

```jsx
import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  // Expensive calculation only runs when items or filter changes
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  return (
    <div>
      <input 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 7. useCallback
**Memory Trick**: "Callback = Cache function, prevents unnecessary re-renders of child components"

```jsx
import React, { useState, useCallback, memo } from 'react';

// Memoized child component
const ChildComponent = memo(({ onClick, name }) => {
  console.log(`${name} rendered`);
  return <button onClick={onClick}>Click me</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Without useCallback, this function is recreated on every render
  const handleClick = useCallback(() => {
    console.log('Button clicked!');
  }, []); // Empty dependency array = function never changes
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ChildComponent onClick={handleClick} name="Child" />
    </div>
  );
}
```

### 8. useLayoutEffect
**Memory Trick**: "Layout = Before paint, synchronous, use for DOM measurements"

```jsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function MeasuredComponent() {
  const [height, setHeight] = useState(0);
  const divRef = useRef(null);
  
  useLayoutEffect(() => {
    // Runs synchronously after all DOM mutations
    // but before the browser paints
    if (divRef.current) {
      setHeight(divRef.current.getBoundingClientRect().height);
    }
  });
  
  return (
    <div>
      <div ref={divRef} style={{ padding: '20px', background: 'lightblue' }}>
        This div's height is: {height}px
      </div>
    </div>
  );
}
```

---

## Utility Hooks

### 9. useId
**Memory Trick**: "Id = Unique identifier, for accessibility"

```jsx
import React, { useId } from 'react';

function FormField({ label, type = 'text' }) {
  const id = useId();
  
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </div>
  );
}

function MyForm() {
  return (
    <form>
      <FormField label="Name" />
      <FormField label="Email" type="email" />
      <FormField label="Age" type="number" />
    </form>
  );
}
```

### 10. useImperativeHandle
**Memory Trick**: "Imperative = Expose specific methods to parent, rarely used"

```jsx
import React, { useImperativeHandle, useRef, forwardRef } from 'react';

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    scrollIntoView: () => {
      inputRef.current.scrollIntoView();
    },
    getValue: () => {
      return inputRef.current.value;
    }
  }));
  
  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const customInputRef = useRef(null);
  
  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={() => customInputRef.current.focus()}>
        Focus Input
      </button>
      <button onClick={() => alert(customInputRef.current.getValue())}>
        Get Value
      </button>
    </div>
  );
}
```

### 11. useDebugValue
**Memory Trick**: "Debug = Shows custom label in React DevTools"

```jsx
import React, { useState, useDebugValue } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Shows "OnlineStatus: Online" or "OnlineStatus: Offline" in DevTools
  useDebugValue(isOnline ? 'Online' : 'Offline');
  
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

function OnlineStatusIndicator() {
  const isOnline = useOnlineStatus();
  
  return (
    <div>
      Status: {isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
}
```

---

## New/Experimental Hooks

### 12. useTransition
**Memory Trick**: "Transition = Mark updates as non-urgent, keeps UI responsive"

```jsx
import React, { useState, useTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (value) => {
    setQuery(value);
    
    // Mark this update as non-urgent
    startTransition(() => {
      // Simulate expensive search
      const searchResults = performExpensiveSearch(value);
      setResults(searchResults);
    });
  };
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <div>Searching...</div>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 13. useDeferredValue
**Memory Trick**: "Deferred = Delay updates, debounce-like behavior"

```jsx
import React, { useState, useDeferredValue } from 'react';

function SearchWithDeferred() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  // This component will re-render less frequently
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ExpensiveSearchResults query={deferredQuery} />
    </div>
  );
}

function ExpensiveSearchResults({ query }) {
  const results = performExpensiveSearch(query);
  
  return (
    <ul>
      {results.map(result => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}
```

### 14. useOptimistic
**Memory Trick**: "Optimistic = Assume success, update UI immediately"

```jsx
import React, { useOptimistic, useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, newTodo]
  );
  
  const addTodo = async (text) => {
    const tempTodo = { id: Date.now(), text, pending: true };
    
    // Optimistically add todo
    addOptimisticTodo(tempTodo);
    
    try {
      const savedTodo = await saveTodoToServer(text);
      setTodos(prev => [...prev, savedTodo]);
    } catch (error) {
      // Handle error - optimistic update will be reverted
      console.error('Failed to save todo:', error);
    }
  };
  
  return (
    <div>
      <button onClick={() => addTodo('New Todo')}>
        Add Todo
      </button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 15. useActionState
**Memory Trick**: "Action = Form actions with state, combines form handling"

```jsx
import React, { useActionState } from 'react';

async function submitForm(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!name || !email) {
      return { error: 'Name and email are required' };
    }
    
    return { success: `Hello, ${name}! Email: ${email}` };
  } catch (error) {
    return { error: 'Something went wrong' };
  }
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, null);
  
  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      
      {state?.error && <div style={{ color: 'red' }}>{state.error}</div>}
      {state?.success && <div style={{ color: 'green' }}>{state.success}</div>}
    </form>
  );
}
```

### 16. useInsertionEffect
**Memory Trick**: "Insertion = Before DOM mutations, for CSS-in-JS libraries"

```jsx
import React, { useInsertionEffect } from 'react';

function useInjectStyles(styles) {
  useInsertionEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [styles]);
}

function StyledComponent() {
  useInjectStyles(`
    .my-component {
      color: blue;
      font-size: 16px;
    }
  `);
  
  return <div className="my-component">Styled content</div>;
}
```

### 17. useSyncExternalStore
**Memory Trick**: "Sync External = Subscribe to external data sources"

```jsx
import React, { useSyncExternalStore } from 'react';

// External store (could be Redux, Zustand, etc.)
const store = {
  state: { count: 0 },
  listeners: new Set(),
  
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  
  getSnapshot() {
    return this.state;
  },
  
  increment() {
    this.state = { count: this.state.count + 1 };
    this.listeners.forEach(listener => listener());
  }
};

function Counter() {
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store)
  );
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => store.increment()}>
        Increment
      </button>
    </div>
  );
}
```

---

## Memory Tricks Summary

### 🧠 Easy Memory Techniques

1. **useState**: "**S**tate **S**tarts **S**imple" - Basic state management
2. **useEffect**: "**E**ffect = **E**xecute after render" - Side effects
3. **useContext**: "**C**ontext = **C**ross-component sharing" - No prop drilling
4. **useReducer**: "**R**educer = **R**edux pattern" - Complex state logic
5. **useRef**: "**R**ef = **R**eference, no **R**e-render" - DOM access & mutable values
6. **useMemo**: "**M**emo = **M**emoize expensive calculations" - Performance
7. **useCallback**: "**C**allback = **C**ache functions" - Prevent child re-renders
8. **useLayoutEffect**: "**L**ayout = before paint, **L**ike componentDidMount but synchronous"
9. **useId**: "**I**d = unique **I**dentifier" - Accessibility
10. **useImperativeHandle**: "**I**mperative = **I**mpose custom methods" - Rarely used
11. **useDebugValue**: "**D**ebug = **D**evTools display" - Development helper
12. **useTransition**: "**T**ransition = **T**ask prioritization" - Non-urgent updates
13. **useDeferredValue**: "**D**eferred = **D**elay updates" - Debounce-like
14. **useOptimistic**: "**O**ptimistic = **O**ptimistically update UI" - Assume success
15. **useActionState**: "**A**ction = **A**synchronous form handling" - Form state
16. **useInsertionEffect**: "**I**nsertion = **I**nject styles before DOM" - CSS-in-JS
17. **useSyncExternalStore**: "**S**ync **E**xternal = **S**ubscribe to external data" - External stores

### 📱 Usage Categories

**Basic State Management**: useState, useReducer
**Side Effects**: useEffect, useLayoutEffect, useInsertionEffect
**Performance**: useMemo, useCallback, useTransition, useDeferredValue
**Data Sharing**: useContext, useSyncExternalStore
**DOM/Refs**: useRef, useImperativeHandle
**Utilities**: useId, useDebugValue
**Modern/Experimental**: useOptimistic, useActionState

### 🎯 Common Patterns

1. **Always use dependency arrays** in useEffect, useMemo, useCallback
2. **useCallback + memo** for optimizing child components
3. **useRef for DOM access** and mutable values
4. **useContext for global state** without prop drilling
5. **useReducer for complex state logic** instead of multiple useState
6. **useTransition for non-urgent updates** to keep UI responsive
7. **useMemo for expensive calculations** only

---

## 🚀 Practice Exercises

Try building these to master the hooks:

1. **Todo App**: useState, useEffect, useContext
2. **Search with Debounce**: useDeferredValue, useTransition
3. **Form Validation**: useActionState, useOptimistic
4. **Theme Switcher**: useContext, useLocalStorage custom hook
5. **Infinite Scroll**: useEffect, useRef, useMemo
6. **Shopping Cart**: useReducer, useContext, useMemo

Remember: **Practice makes perfect!** Start with basic hooks and gradually work your way up to the advanced ones. 🎉