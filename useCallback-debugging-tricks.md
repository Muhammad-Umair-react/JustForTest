# useCallback Debugging Tricks 🔍

## How to Check if Child Components Re-render Unnecessarily

### Method 1: Console.log in Child Component ✅ (Easiest)

```jsx
import React, { useState, useCallback, memo } from 'react';

const ChildComponent = memo(({ onClick, name }) => {
  // This will log every time the component renders
  console.log(`🔄 ${name} component rendered at:`, new Date().toLocaleTimeString());
  
  return <button onClick={onClick}>Click me</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // ❌ WITHOUT useCallback - child re-renders on every parent render
  const handleClickBad = () => {
    console.log('Button clicked!');
  };
  
  // ✅ WITH useCallback - child only re-renders when dependencies change
  const handleClickGood = useCallback(() => {
    console.log('Button clicked!');
  }, []);
  
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name (triggers parent re-render)"
      />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      {/* Try both and see the difference in console */}
      <ChildComponent onClick={handleClickBad} name="Bad Child" />
      <ChildComponent onClick={handleClickGood} name="Good Child" />
    </div>
  );
}
```

### Method 2: Custom Hook to Track Renders 🎯

```jsx
import React, { useState, useCallback, memo, useRef, useEffect } from 'react';

// Custom hook to track renders
function useRenderCount(componentName) {
  const renderCount = useRef(0);
  const prevProps = useRef();
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
  });
  
  return renderCount.current;
}

const ChildComponent = memo(({ onClick, name, count }) => {
  const renders = useRenderCount(`Child-${name}`);
  
  return (
    <div style={{ border: '1px solid blue', margin: '10px', padding: '10px' }}>
      <h4>{name} (Rendered: {renders} times)</h4>
      <button onClick={onClick}>Click me</button>
      <p>Parent count: {count}</p>
    </div>
  );
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const parentRenders = useRenderCount('Parent');
  
  const handleClickWithCallback = useCallback(() => {
    console.log('Button with useCallback clicked!');
  }, []);
  
  const handleClickWithoutCallback = () => {
    console.log('Button without useCallback clicked!');
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>Parent (Rendered: {parentRenders} times)</h3>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type to trigger re-render"
      />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      
      <ChildComponent 
        onClick={handleClickWithCallback} 
        name="With useCallback" 
        count={count}
      />
      <ChildComponent 
        onClick={handleClickWithoutCallback} 
        name="Without useCallback" 
        count={count}
      />
    </div>
  );
}
```

### Method 3: React.memo with Custom Comparison 🧐

```jsx
import React, { useState, useCallback, memo } from 'react';

// Custom comparison function to debug what props changed
const ChildComponent = memo(({ onClick, name, data }) => {
  console.log(`🔄 ${name} rendered`);
  
  return (
    <div style={{ border: '1px solid green', margin: '5px', padding: '10px' }}>
      <h4>{name}</h4>
      <button onClick={onClick}>Click me</button>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - logs what changed
  const keys = Object.keys(nextProps);
  let hasChanged = false;
  
  keys.forEach(key => {
    if (prevProps[key] !== nextProps[key]) {
      console.log(`🔍 ${nextProps.name}: "${key}" prop changed`, {
        from: prevProps[key],
        to: nextProps[key]
      });
      hasChanged = true;
    }
  });
  
  if (!hasChanged) {
    console.log(`✅ ${nextProps.name}: No props changed, skipping render`);
  }
  
  return !hasChanged; // true = skip render, false = re-render
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  // ✅ Memoized callback
  const memoizedCallback = useCallback(() => {
    console.log('Memoized callback executed');
  }, []);
  
  // ❌ New function on every render
  const newCallback = () => {
    console.log('New callback executed');
  };
  
  // ❌ New object on every render
  const newObject = { value: 'constant' };
  
  // ✅ Memoized object
  const memoizedObject = useCallback(() => ({ value: 'constant' }), []);
  
  return (
    <div style={{ padding: '20px' }}>
      <input 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here to trigger parent re-render"
      />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      
      <ChildComponent 
        onClick={memoizedCallback}
        name="Good Child (useCallback)"
        data={memoizedObject()}
      />
      
      <ChildComponent 
        onClick={newCallback}
        name="Bad Child (new function)"
        data={newObject}
      />
    </div>
  );
}
```

### Method 4: Using React DevTools Profiler 🛠️

```jsx
import React, { useState, useCallback, memo, Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  console.log('Profiler:', {
    id,
    phase, // "mount" or "update"
    actualDuration, // Time spent rendering
    baseDuration, // Estimated time without memoization
    startTime,
    commitTime
  });
}

const ChildComponent = memo(({ onClick, name }) => {
  return (
    <div style={{ border: '1px solid purple', margin: '5px', padding: '10px' }}>
      <h4>{name}</h4>
      <button onClick={onClick}>Click me</button>
    </div>
  );
});

function ProfilerExample() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);
  
  return (
    <Profiler id="ProfilerExample" onRender={onRenderCallback}>
      <div>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
        <ChildComponent onClick={handleClick} name="Profiled Child" />
      </div>
    </Profiler>
  );
}
```

### Method 5: Visual Highlight with why-did-you-render 📦

```jsx
// First install: npm install @welldone-software/why-did-you-render
// Add this to your index.js or App.js

import React from 'react';

// Only in development
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOwnerReasons: true,
  });
}

// Mark components to track
const ChildComponent = memo(({ onClick, name }) => {
  return <button onClick={onClick}>{name}</button>;
});

// Add this property to track the component
ChildComponent.whyDidYouRender = true;
```

### Method 6: Highlight Updates in Browser 🎨

```jsx
import React, { useState, useCallback, memo, useEffect, useRef } from 'react';

// Component that visually highlights when it re-renders
const HighlightOnRender = memo(({ children, name }) => {
  const [highlight, setHighlight] = useState(false);
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    setHighlight(true);
    
    const timer = setTimeout(() => setHighlight(false), 500);
    return () => clearTimeout(timer);
  });
  
  return (
    <div 
      style={{
        border: highlight ? '3px solid red' : '1px solid gray',
        backgroundColor: highlight ? 'rgba(255, 0, 0, 0.1)' : 'white',
        margin: '10px',
        padding: '10px',
        transition: 'all 0.3s ease'
      }}
    >
      <small>🔄 Renders: {renderCount.current}</small>
      <div>{children}</div>
    </div>
  );
});

const ChildComponent = memo(({ onClick, name }) => {
  return (
    <HighlightOnRender name={name}>
      <h4>{name}</h4>
      <button onClick={onClick}>Click me</button>
    </HighlightOnRender>
  );
});

function VisualDebugExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  const memoizedClick = useCallback(() => {
    console.log('Memoized click');
  }, []);
  
  const newClick = () => {
    console.log('New click');
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <input 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to see re-renders"
      />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      
      <ChildComponent onClick={memoizedClick} name="✅ With useCallback" />
      <ChildComponent onClick={newClick} name="❌ Without useCallback" />
    </div>
  );
}
```

## 🎯 Quick Debugging Checklist

### 1. **Check Console Logs**
- Add `console.log` in child components
- Look for unexpected render logs

### 2. **Use React DevTools**
- Install React Developer Tools browser extension
- Go to "Profiler" tab
- Record interactions and see which components re-rendered

### 3. **Common Causes of Unnecessary Re-renders**
```jsx
// ❌ These cause unnecessary re-renders:
const badCallback = () => {}; // New function every render
const badObject = { key: 'value' }; // New object every render
const badArray = ['item1', 'item2']; // New array every render

// ✅ These don't:
const goodCallback = useCallback(() => {}, []); // Memoized function
const goodObject = useMemo(() => ({ key: 'value' }), []); // Memoized object
const goodArray = useMemo(() => ['item1', 'item2'], []); // Memoized array
```

### 4. **Performance Testing Pattern**
```jsx
// Test with this pattern:
function TestComponent() {
  const [trigger, setTrigger] = useState(0);
  
  // Your callback here - try with and without useCallback
  const callback = useCallback(() => {}, []);
  
  return (
    <div>
      <button onClick={() => setTrigger(t => t + 1)}>
        Trigger Re-render ({trigger})
      </button>
      <ChildComponent callback={callback} />
    </div>
  );
}
```

## 💡 Pro Tips

1. **Use React DevTools Profiler** - Most reliable method
2. **Console.log with timestamps** - Quick and easy debugging
3. **Visual highlights** - Great for understanding render patterns
4. **why-did-you-render** - Comprehensive analysis in development
5. **Always test without useCallback first** - See the difference

Remember: Only optimize with `useCallback` when you actually have performance issues! 🚀