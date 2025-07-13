import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../Auth/AuthContext";

export const InventoryContext = React.createContext();

export const useInventory = () => React.useContext(InventoryContext);

// Mock data for bike parts inventory
const mockInventoryData = [
  {
    id: '1',
    name: 'Mountain Bike Tire',
    category: 'Tires',
    price: 45,
    costPrice: 30,
    quantity: 25,
    userId: 'mock-user-123',
    brand: 'Maxxis',
    model: 'CrossMark',
    size: '29x2.25'
  },
  {
    id: '2',
    name: 'Road Bike Chain',
    category: 'Drivetrain',
    price: 35,
    costPrice: 22,
    quantity: 50,
    userId: 'mock-user-123',
    brand: 'Shimano',
    model: 'HG-601',
    size: '11-speed'
  },
  {
    id: '3',
    name: 'Disc Brake Pads',
    category: 'Brakes',
    price: 25,
    costPrice: 15,
    quantity: 100,
    userId: 'mock-user-123',
    brand: 'Shimano',
    model: 'J02A',
    size: 'Resin'
  },
  {
    id: '4',
    name: 'Carbon Fiber Handlebar',
    category: 'Handlebars',
    price: 120,
    costPrice: 80,
    quantity: 12,
    userId: 'mock-user-123',
    brand: 'FSA',
    model: 'K-Force',
    size: '42cm'
  },
  {
    id: '5',
    name: 'Bike Chain Lube',
    category: 'Maintenance',
    price: 12,
    costPrice: 8,
    quantity: 75,
    userId: 'mock-user-123',
    brand: 'Finish Line',
    model: 'Wet Lube',
    size: '120ml'
  },
  {
    id: '6',
    name: 'Bike Helmet',
    category: 'Safety',
    price: 85,
    costPrice: 55,
    quantity: 20,
    userId: 'mock-user-123',
    brand: 'Giro',
    model: 'Aether',
    size: 'Medium'
  },
  {
    id: '7',
    name: 'Bike Pedals',
    category: 'Pedals',
    price: 65,
    costPrice: 40,
    quantity: 30,
    userId: 'mock-user-123',
    brand: 'Shimano',
    model: 'SPD',
    size: 'Clipless'
  },
  {
    id: '8',
    name: 'Inner Tube',
    category: 'Tires',
    price: 8,
    costPrice: 5,
    quantity: 200,
    userId: 'mock-user-123',
    brand: 'Continental',
    model: 'Race',
    size: '700x23-28c'
  }
];

export const InventoryProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const fetchItems = async () => {
    if (!currentUser) return [];

    try {
      const q = query(
        collection(db, "inventory"),
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log('Using mock data for development');
      // Return mock data if Firebase is not configured
      return mockInventoryData.filter(item => item.userId === currentUser.uid);
    }
  };

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["inventory", currentUser?.uid],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!currentUser, // Only fetch when user is available
  });

  // Calculate global inventory metrics including profit
  const totalItems = items.length;
  const totalValue = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1),
      0
    );
  }, [items]);

  const totalCostValue = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.costPrice) || 0) * (parseInt(item.quantity) || 1),
      0
    );
  }, [items]);

  const totalPotentialProfit = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        ((parseFloat(item.price) || 0) - (parseFloat(item.costPrice) || 0)) *
          (parseInt(item.quantity) || 1),
      0
    );
  }, [items]);

  const profitMargin = useMemo(() => {
    return totalValue > 0
      ? ((totalValue - totalCostValue) / totalValue) * 100
      : 0;
  }, [totalValue, totalCostValue]);

  const categories = useMemo(() => {
    const categorySet = new Set();
    items.forEach((item) => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });
    return categorySet.size;
  }, [items]);

  const lowStockItems = useMemo(() => {
    return items.filter(item => item.quantity <= 10);
  }, [items]);

  const value = {
    items,
    isLoading,
    totalItems,
    totalValue,
    totalCostValue,
    totalPotentialProfit,
    profitMargin,
    categories,
    lowStockItems,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};