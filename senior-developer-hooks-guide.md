# React Hooks for Senior Developers 🚀
*Real-World Production Scenarios & Best Practices*

## Priority Ranking for Production Applications

### 🥇 **Tier 1: Essential (Use Daily)**
**Master these first - they solve 80% of real-world problems**

#### 1. useState + useEffect (The Foundation)
**Real-World Scenario**: Data fetching, form state, API integration

```jsx
// ✅ Production-ready data fetching pattern
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          ...options,
          signal: AbortController.signal // Handle cleanup
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      cancelled = true; // Prevent state updates after unmount
    };
  }, [url, JSON.stringify(options)]);
  
  return { data, loading, error };
}

// Usage in production
function UserDashboard({ userId }) {
  const { data: user, loading, error } = useApi(`/api/users/${userId}`);
  
  if (loading) return <Spinner />;
  if (error) return <ErrorBoundary error={error} />;
  
  return <UserProfile user={user} />;
}
```

#### 2. useMemo (Performance Optimization)
**Real-World Scenario**: Expensive calculations, complex filtering, data transformations

```jsx
// ✅ Real-world performance optimization
function ProductCatalog({ products, filters, sortBy, searchTerm }) {
  // Expensive filtering and sorting - only recalculate when dependencies change
  const processedProducts = useMemo(() => {
    console.log('🔄 Processing products...'); // Should only log when needed
    
    return products
      .filter(product => {
        // Complex filtering logic
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        return filters.every(filter => {
          switch (filter.type) {
            case 'price':
              return product.price >= filter.min && product.price <= filter.max;
            case 'category':
              return filter.values.includes(product.category);
            case 'rating':
              return product.rating >= filter.minRating;
            default:
              return true;
          }
        });
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, filters, sortBy, searchTerm]);
  
  // Pagination calculation
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProducts, currentPage, itemsPerPage]);
  
  return (
    <div>
      <ProductGrid products={paginatedProducts} />
      <Pagination 
        total={processedProducts.length} 
        current={currentPage}
        pageSize={itemsPerPage}
      />
    </div>
  );
}
```

#### 3. useCallback (Component Optimization)
**Real-World Scenario**: Parent-child optimization, event handlers, API calls

```jsx
// ✅ Production pattern for complex forms
function ProjectManagement({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  
  // ✅ Stable reference - child won't re-render unnecessarily
  const handleTaskUpdate = useCallback(async (taskId, updates) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      const updatedTask = await response.json();
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      toast.error('Failed to update task');
    }
  }, []); // No dependencies = function never changes
  
  // ✅ Optimized bulk operations
  const handleBulkAction = useCallback(async (action) => {
    const taskIds = Array.from(selectedTasks);
    
    try {
      await fetch('/api/tasks/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, taskIds })
      });
      
      // Refresh tasks after bulk operation
      refetchTasks();
      setSelectedTasks(new Set());
    } catch (error) {
      toast.error('Bulk operation failed');
    }
  }, [selectedTasks, refetchTasks]);
  
  return (
    <div>
      <TaskFilters onFilterChange={setFilters} />
      <BulkActions 
        selectedCount={selectedTasks.size}
        onBulkAction={handleBulkAction} // Stable reference
      />
      <TaskList 
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate} // Stable reference
        onSelectionChange={setSelectedTasks}
      />
    </div>
  );
}
```

#### 4. useRef (DOM Access & Mutable Values)
**Real-World Scenario**: Focus management, scroll position, timers, previous values

```jsx
// ✅ Production patterns with useRef
function InfiniteScrollList({ loadMore, hasMore }) {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);
  const previousScrollTop = useRef(0);
  
  // Intersection Observer for infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          loadingRef.current = true;
          loadMore().finally(() => {
            loadingRef.current = false;
          });
        }
      },
      { threshold: 0.1 }
    );
    
    const sentinel = container.querySelector('[data-sentinel]');
    if (sentinel) {
      observerRef.current.observe(sentinel);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore]);
  
  // Preserve scroll position during updates
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = previousScrollTop.current;
    }
  });
  
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      previousScrollTop.current = containerRef.current.scrollTop;
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="infinite-scroll-container"
    >
      {/* List content */}
      <div data-sentinel />
    </div>
  );
}
```

---

### 🥈 **Tier 2: Advanced (Use Weekly)**

#### 5. useReducer (Complex State Logic)
**Real-World Scenario**: Shopping cart, multi-step forms, complex UI state

```jsx
// ✅ Production shopping cart with complex logic
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.options) === JSON.stringify(action.payload.options)
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item === existingItem 
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, action.payload]
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };
      
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discounts: [...state.discounts, action.payload],
        discountError: null
      };
      
    case 'CALCULATE_TOTALS':
      const subtotal = state.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      const discountAmount = state.discounts.reduce((sum, discount) => 
        sum + calculateDiscount(discount, subtotal), 0
      );
      
      const tax = (subtotal - discountAmount) * state.taxRate;
      const shipping = calculateShipping(state.items, state.shippingAddress);
      
      return {
        ...state,
        totals: {
          subtotal,
          discount: discountAmount,
          tax,
          shipping,
          total: subtotal - discountAmount + tax + shipping
        }
      };
      
    default:
      return state;
  }
};

function useShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discounts: [],
    totals: { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 },
    taxRate: 0.08,
    shippingAddress: null
  });
  
  // Automatically recalculate totals when items change
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items, state.discounts, state.taxRate, state.shippingAddress]);
  
  return { state, dispatch };
}
```

#### 6. useContext (Global State Management)
**Real-World Scenario**: Theme, authentication, user preferences, app settings

```jsx
// ✅ Production authentication context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  
  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token)
        .then(userData => {
          setUser(userData);
          setPermissions(userData.permissions || []);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = useCallback(async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const { user, token, permissions } = await response.json();
    
    localStorage.setItem('authToken', token);
    setUser(user);
    setPermissions(permissions);
    
    return user;
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setPermissions([]);
  }, []);
  
  const hasPermission = useCallback((permission) => {
    return permissions.includes(permission) || user?.role === 'admin';
  }, [permissions, user?.role]);
  
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  }), [user, loading, login, logout, hasPermission]);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

### 🥉 **Tier 3: Modern/Performance (Use Monthly)**

#### 7. useTransition (UI Responsiveness)
**Real-World Scenario**: Search, filtering, large lists, data tables

```jsx
// ✅ Production search with responsive UI
function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (value) => {
    setQuery(value); // Immediate update for input
    
    // Non-urgent update for search results
    startTransition(() => {
      if (value.length < 2) {
        setResults([]);
        return;
      }
      
      // Expensive search operation
      const searchResults = performComplexSearch(value, {
        fuzzyMatch: true,
        includeMetadata: true,
        maxResults: 100
      });
      
      setResults(searchResults);
    });
  };
  
  return (
    <div>
      <SearchInput 
        value={query}
        onChange={handleSearch}
        placeholder="Search products..."
      />
      
      {isPending && <SearchSpinner />}
      
      <SearchResults 
        results={results}
        isLoading={isPending}
        query={query}
      />
    </div>
  );
}
```

#### 8. useDeferredValue (Debounce-like Behavior)
**Real-World Scenario**: Real-time previews, auto-save, live validation

```jsx
// ✅ Production form with live preview
function DocumentEditor() {
  const [content, setContent] = useState('');
  const deferredContent = useDeferredValue(content);
  
  // Auto-save with debounced content
  useEffect(() => {
    if (deferredContent && deferredContent !== initialContent) {
      const timeoutId = setTimeout(() => {
        autoSave(deferredContent);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [deferredContent]);
  
  return (
    <div className="editor-layout">
      <Editor 
        value={content}
        onChange={setContent}
        placeholder="Start writing..."
      />
      
      {/* Preview updates with deferred value */}
      <Preview content={deferredContent} />
    </div>
  );
}
```

#### 9. useSyncExternalStore (External Data Sources)
**Real-World Scenario**: Redux, Zustand, WebSocket data, browser APIs

```jsx
// ✅ Production WebSocket integration
function useWebSocketData(url) {
  const [data, setData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const subscribe = useCallback((callback) => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setConnectionStatus('connected');
    };
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
      callback(); // Notify React of the change
    };
    
    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };
    
    ws.onerror = () => {
      setConnectionStatus('error');
    };
    
    return () => {
      ws.close();
    };
  }, [url]);
  
  const getSnapshot = useCallback(() => data, [data]);
  
  const syncedData = useSyncExternalStore(subscribe, getSnapshot);
  
  return { data: syncedData, connectionStatus };
}
```

---

## 🎯 **Production Best Practices**

### **1. Performance Optimization Strategy**
```jsx
// ✅ Optimized component hierarchy
const ExpensiveChild = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => 
    expensiveCalculation(data), [data]
  );
  
  const handleUpdate = useCallback((id, changes) => {
    onUpdate(id, changes);
  }, [onUpdate]);
  
  return <ComplexUI data={processedData} onUpdate={handleUpdate} />;
});
```

### **2. Error Handling Pattern**
```jsx
// ✅ Production error handling
function useAsyncOperation() {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  
  const execute = useCallback(async (operation) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await operation();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  }, []);
  
  return { ...state, execute };
}
```

### **3. Custom Hook Composition**
```jsx
// ✅ Reusable business logic
function useUserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const { execute: fetchUsers, loading } = useAsyncOperation();
  const { execute: updateUser } = useAsyncOperation();
  
  const loadUsers = useCallback(async (filters = {}) => {
    return await fetchUsers(() => 
      api.get('/users', { params: filters })
    );
  }, [fetchUsers]);
  
  const handleUserUpdate = useCallback(async (userId, updates) => {
    const updated = await updateUser(() => 
      api.patch(`/users/${userId}`, updates)
    );
    
    setUsers(prev => 
      prev.map(u => u.id === userId ? updated : u)
    );
    
    return updated;
  }, [updateUser]);
  
  return {
    users,
    loading,
    loadUsers,
    updateUser: handleUserUpdate,
    canEdit: user?.role === 'admin'
  };
}
```

## 🚨 **Hooks to Use Sparingly**

### **Rarely Needed (< 5% of projects)**
- `useImperativeHandle` - Only for library components
- `useInsertionEffect` - Only for CSS-in-JS libraries  
- `useDebugValue` - Only for custom hook debugging
- `useLayoutEffect` - Only for DOM measurements
- `useOptimistic` - Only for optimistic updates
- `useActionState` - Only for Server Components

## 📊 **Decision Matrix for Senior Developers**

| Scenario | Primary Hook | Secondary Hook | Pattern |
|----------|-------------|----------------|---------|
| **API Data Fetching** | `useState` + `useEffect` | `useMemo` | Custom hook |
| **Form State** | `useState` or `useReducer` | `useCallback` | Controlled inputs |
| **Performance Issues** | `useMemo` + `useCallback` | `memo()` | Optimization |
| **Global State** | `useContext` | `useReducer` | Provider pattern |
| **Complex UI State** | `useReducer` | `useMemo` | State machine |
| **Real-time Data** | `useSyncExternalStore` | `useEffect` | WebSocket/SSE |
| **Search/Filter** | `useTransition` | `useDeferredValue` | Responsive UI |

## 🎯 **Priority for Learning/Mastering**

1. **Master First (Week 1-2)**: `useState`, `useEffect`, `useMemo`, `useCallback`
2. **Learn Next (Week 3-4)**: `useReducer`, `useContext`, `useRef`
3. **Advanced (Month 2)**: `useTransition`, `useDeferredValue`, `useSyncExternalStore`
4. **Specialized (As needed)**: `useLayoutEffect`, `useOptimistic`, `useActionState`

**Remember**: Focus on solving real problems, not using every hook. The best senior developers use the simplest solution that works effectively! 🚀