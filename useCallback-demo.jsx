import React, { useState, useCallback, memo, useRef, useEffect } from 'react';

// Simple render counter hook
function useRenderCount(name) {
  const count = useRef(0);
  useEffect(() => {
    count.current += 1;
    console.log(`🔄 ${name} rendered ${count.current} times`);
  });
  return count.current;
}

// Child component that shows when it renders
const ChildComponent = memo(({ onClick, name, style }) => {
  const renderCount = useRenderCount(name);
  
  return (
    <div style={{
      border: '2px solid #007acc',
      padding: '15px',
      margin: '10px',
      borderRadius: '8px',
      backgroundColor: '#f0f8ff',
      ...style
    }}>
      <h4>{name}</h4>
      <p>🔄 Renders: <strong>{renderCount}</strong></p>
      <button 
        onClick={onClick}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click Me!
      </button>
    </div>
  );
});

function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const parentRenders = useRenderCount('Parent');

  // ✅ WITH useCallback - function is memoized
  const memoizedCallback = useCallback(() => {
    alert('Memoized callback clicked! 🎉');
  }, []); // Empty deps = never changes

  // ❌ WITHOUT useCallback - new function every render
  const regularCallback = () => {
    alert('Regular callback clicked! 😐');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>useCallback Demo 🎣</h2>
      <p>Parent renders: <strong>{parentRenders}</strong></p>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Controls (trigger parent re-renders):</h3>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here to trigger re-render..."
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Count: {count}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <ChildComponent
          onClick={memoizedCallback}
          name="✅ With useCallback"
          style={{ borderColor: '#28a745' }}
        />
        
        <ChildComponent
          onClick={regularCallback}
          name="❌ Without useCallback"
          style={{ borderColor: '#dc3545' }}
        />
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '5px',
        border: '1px solid #ffeaa7'
      }}>
        <h4>🧪 Experiment:</h4>
        <ol>
          <li><strong>Type in the input</strong> - Watch console for render logs</li>
          <li><strong>Click the Count button</strong> - See which child re-renders</li>
          <li><strong>Open DevTools Console</strong> - See the difference!</li>
        </ol>
        
        <p><strong>Expected Result:</strong></p>
        <ul>
          <li>✅ <strong>Green child (with useCallback)</strong>: Only renders once (initial)</li>
          <li>❌ <strong>Red child (without useCallback)</strong>: Re-renders every time parent updates</li>
        </ul>
      </div>
    </div>
  );
}

export default UseCallbackDemo;