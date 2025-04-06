import { useState, useEffect } from 'react';
import { Calendar, Search, Menu, Map, Settings, ChevronLeft, Plus, X, Trash2 } from 'lucide-react';

export default function ExpenseTracker() {
  // Default sample data
  const defaultTrips = [
    { id: 1, name: 'Guatemala', total: 5268.20, dailyAvg: 239.46, currency: 'NZ$', endDate: '2023-03-24' },
    { id: 2, name: 'Sicily', total: 5677.05, dailyAvg: 258.05, currency: 'NZ$', endDate: '2023-05-15' },
    { id: 3, name: 'Japan', total: 6823.50, dailyAvg: 325.88, currency: 'NZ$', endDate: '2023-07-10' },
  ];
  
  const defaultExpenses = {
    1: [
      { id: 1, date: '2023-03-19', name: 'Volcano Hike 🏔️', category: 'Activities', amount: 462.53, currency: 'NZ$', originalAmount: 287.00, originalCurrency: 'US$' },
      { id: 2, date: '2023-03-18', name: 'Cafe de Artista', category: 'Workspace', amount: 10.30, currency: 'NZ$', originalAmount: 53.00, originalCurrency: 'GTQ' },
      { id: 3, date: '2023-03-18', name: 'Bus to Antigua', category: 'Transportation', amount: 80.58, currency: 'NZ$', originalAmount: 50.00, originalCurrency: 'US$' },
      { id: 4, date: '2023-03-18', name: 'Bus Snacks & Drinks', category: 'Groceries', amount: 4.95, currency: 'NZ$', originalAmount: 25.00, originalCurrency: 'GTQ' },
      { id: 5, date: '2023-03-18', name: 'Lunch 80s Music Cafe', category: 'Restaurants', amount: 24.76, currency: 'NZ$', originalAmount: 120.00, originalCurrency: 'GTQ' },
      { id: 6, date: '2023-03-18', name: 'Boat to Panajachel', category: 'Transportation', amount: 12.38, currency: 'NZ$', originalAmount: 60.00, originalCurrency: 'GTQ' },
      { id: 7, date: '2023-03-18', name: 'Antigua Hostel', category: 'Accommodation', amount: 75.87, currency: 'NZ$', originalAmount: 47.00, originalCurrency: 'US$' },
    ],
    2: [
      { id: 1, date: '2023-05-10', name: 'Taormina Beach Day', category: 'Activities', amount: 55.20, currency: 'NZ$', originalAmount: 32.00, originalCurrency: '€' },
      { id: 2, date: '2023-05-12', name: 'Mount Etna Tour', category: 'Activities', amount: 189.75, currency: 'NZ$', originalAmount: 110.00, originalCurrency: '€' },
      { id: 3, date: '2023-05-11', name: 'Seafood Restaurant', category: 'Restaurants', amount: 86.25, currency: 'NZ$', originalAmount: 50.00, originalCurrency: '€' },
    ],
    3: [
      { id: 1, date: '2023-07-05', name: 'Tokyo Hotel', category: 'Accommodation', amount: 1250.00, currency: 'NZ$', originalAmount: 96500.00, originalCurrency: '¥' },
      { id: 2, date: '2023-07-06', name: 'Shinkansen to Kyoto', category: 'Transportation', amount: 178.50, currency: 'NZ$', originalAmount: 13760.00, originalCurrency: '¥' },
    ],
  };
  
  // Initialize state from localStorage or use defaults
  const [trips, setTrips] = useState(() => {
    try {
      const savedTrips = localStorage.getItem('trips');
      return savedTrips ? JSON.parse(savedTrips) : defaultTrips;
    } catch (error) {
      console.error('Error loading trips from localStorage:', error);
      return defaultTrips;
    }
  });
  
  const [expenses, setExpenses] = useState(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses');
      return savedExpenses ? JSON.parse(savedExpenses) : defaultExpenses;
    } catch (error) {
      console.error('Error loading expenses from localStorage:', error);
      return defaultExpenses;
    }
  });
  
  // Current selected trip
  const [selectedTrip, setSelectedTrip] = useState(() => {
    try {
      const savedSelectedTripId = localStorage.getItem('selectedTripId');
      const id = savedSelectedTripId ? parseInt(savedSelectedTripId, 10) : 1;
      return trips.find(trip => trip.id === id) || trips[0];
    } catch (error) {
      console.error('Error loading selectedTrip from localStorage:', error);
      return trips[0];
    }
  });
  
  // New expense entry values
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: 'Activities',
    date: new Date().toISOString().substring(0, 10),
    currency: 'DKK',
  });
  
  // Current view state (trips list, trip detail, new expense)
  const [currentView, setCurrentView] = useState('tripDetail'); // Can be 'tripsList', 'tripDetail', 'newExpense'
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips to localStorage:', error);
    }
  }, [trips]);
  
  useEffect(() => {
    try {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
    }
  }, [expenses]);
  
  useEffect(() => {
    try {
      localStorage.setItem('selectedTripId', selectedTrip.id.toString());
    } catch (error) {
      console.error('Error saving selectedTripId to localStorage:', error);
    }
  }, [selectedTrip.id]);
  
  // Register service worker for offline access
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful');
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);
  
  // Get expenses for the selected trip
  const tripExpenses = expenses[selectedTrip.id] || [];
  
  // Calculate trip totals
  const calculateTripStats = (tripId) => {
    const tripExps = expenses[tripId] || [];
    const total = tripExps.reduce((sum, exp) => sum + exp.amount, 0);
    const dailyAvg = tripExps.length > 0 ? (total / tripExps.length).toFixed(2) : 0;
    return { total, dailyAvg };
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    const categoryColors = {
      'Activities': 'bg-red-500',
      'Workspace': 'bg-blue-400',
      'Transportation': 'bg-orange-500',
      'Groceries': 'bg-blue-600',
      'Restaurants': 'bg-teal-500',
      'Accommodation': 'bg-red-400',
    };
    return categoryColors[category] || 'bg-gray-500';
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Activities':
        return <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">🏃</div>;
      case 'Workspace':
        return <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-white">💻</div>;
      case 'Transportation':
        return <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">🚌</div>;
      case 'Groceries':
        return <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">🛒</div>;
      case 'Restaurants':
        return <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white">🍽️</div>;
      case 'Accommodation':
        return <div className="w-6 h-6 rounded-full bg-red-400 flex items-center justify-center text-white">🏨</div>;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white">📝</div>;
    }
  };
  
  // Add new expense
  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    
    const newId = (expenses[selectedTrip.id]?.length || 0) + 1;
    const newExpenseItem = {
      id: newId,
      date: newExpense.date,
      name: newExpense.name,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      currency: selectedTrip.currency,
      originalAmount: parseFloat(newExpense.amount),
      originalCurrency: newExpense.currency,
    };
    
    const updatedExpenses = {
      ...expenses,
      [selectedTrip.id]: [...(expenses[selectedTrip.id] || []), newExpenseItem]
    };
    
    setExpenses(updatedExpenses);
    
    // Update trip total and daily average
    const stats = calculateTripStats(selectedTrip.id);
    const updatedTrips = trips.map(trip => 
      trip.id === selectedTrip.id 
        ? { ...trip, total: stats.total, dailyAvg: stats.dailyAvg } 
        : trip
    );
    
    setTrips(updatedTrips);
    setSelectedTrip(prev => ({ ...prev, total: stats.total, dailyAvg: stats.dailyAvg }));
    setCurrentView('tripDetail');
    setNewExpense({
      name: '',
      amount: '',
      category: 'Activities',
      date: new Date().toISOString().substring(0, 10),
      currency: 'DKK',
    });
  };
  
  // Delete expense
  const handleDeleteExpense = (expenseId) => {
    const updatedTripExpenses = expenses[selectedTrip.id].filter(exp => exp.id !== expenseId);
    
    const updatedExpenses = {
      ...expenses,
      [selectedTrip.id]: updatedTripExpenses
    };
    
    setExpenses(updatedExpenses);
    
    // Update trip total and daily average
    const stats = calculateTripStats(selectedTrip.id);
    const updatedTrips = trips.map(trip => 
      trip.id === selectedTrip.id 
        ? { ...trip, total: stats.total, dailyAvg: stats.dailyAvg } 
        : trip
    );
    
    setTrips(updatedTrips);
    setSelectedTrip(prev => ({ ...prev, total: stats.total, dailyAvg: stats.dailyAvg }));
  };
  
  // Add new trip
  const handleAddTrip = () => {
    const newId = Math.max(...trips.map(t => t.id)) + 1;
    const newTrip = {
      id: newId,
      name: 'New Trip',
      total: 0,
      dailyAvg: 0,
      currency: 'NZ$',
      endDate: new Date().toISOString().substring(0, 10)
    };
    
    setTrips([...trips, newTrip]);
    setExpenses({
      ...expenses,
      [newId]: []
    });
    setSelectedTrip(newTrip);
    setCurrentView('tripDetail');
  };
  
  // Format date string to display format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  // Group expenses by date
  const groupExpensesByDate = () => {
    const groups = {};
    tripExpenses.forEach(expense => {
      if (!groups[expense.date]) {
        groups[expense.date] = [];
      }
      groups[expense.date].push(expense);
    });
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([date, expenses]) => ({ date, expenses }));
  };
  
  const groupedExpenses = groupExpensesByDate();
  
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Main View - Trip List */}
      {currentView === 'tripsList' && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-800">
            <button className="p-2">
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold flex-1 text-center">My Trips</h1>
            <button className="p-2">
              <Settings size={20} />
            </button>
          </div>
          
          {/* Trip List */}
          <div className="flex-1 overflow-auto">
            {trips.map(trip => (
              <div 
                key={trip.id} 
                className="border-b border-gray-800 p-4 cursor-pointer"
                onClick={() => {
                  setSelectedTrip(trip);
                  setCurrentView('tripDetail');
                }}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{trip.name}</h2>
                  <div className="text-right">
                    <div className="text-xl font-semibold">{trip.currency} {trip.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">Trip ended on {trip.endDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Trip Button */}
          <div className="p-4 flex justify-center">
            <button 
              className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
              onClick={handleAddTrip}
            >
              <Plus size={24} />
            </button>
          </div>
          
          {/* Bottom Navigation */}
          <div className="flex justify-around p-2 border-t border-gray-800">
            <button className="p-2 text-red-500">
              <Trash2 size={20} />
            </button>
            <button className="p-2">
              <Calendar size={20} />
            </button>
            <button className="p-2">
              <Search size={20} />
            </button>
            <button className="p-2">
              <Map size={20} />
            </button>
            <button className="p-2">
              <Settings size={20} />
            </button>
          </div>
        </div>
      )}
      
      {/* Trip Detail View */}
      {currentView === 'tripDetail' && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-800">
            <button 
              className="p-2"
              onClick={() => setCurrentView('tripsList')}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold flex-1 text-center">{selectedTrip.name}</h1>
            <button className="p-2">
              <Settings size={20} />
            </button>
          </div>
          
          {/* Trip Stats */}
          <div className="flex p-4 border-b border-gray-800">
            <div className="flex-1">
              <div className="text-sm text-gray-400">Total</div>
              <div className="text-2xl font-semibold">{selectedTrip.currency} {selectedTrip.total.toFixed(2)}</div>
            </div>
            <div className="flex-1 text-right">
              <div className="text-sm text-gray-400">Daily Average</div>
              <div className="text-2xl font-semibold">{selectedTrip.currency} {selectedTrip.dailyAvg}</div>
            </div>
          </div>
          
          {/* Trip End Date */}
          <div className="flex items-center p-4 border-b border-gray-800 text-sm text-gray-400">
            <span className="mr-2">🏁</span>
            <span>Trip ended on {selectedTrip.endDate}</span>
            <button className="ml-auto text-blue-400">Edit Dates</button>
          </div>
          
          {/* Expenses List */}
          <div className="flex-1 overflow-auto">
            {groupedExpenses.map(group => (
              <div key={group.date}>
                <div className="bg-gray-800 px-4 py-2 sticky top-0">
                  <div className="text-sm">{formatDate(group.date)}</div>
                </div>
                
                {group.expenses.map(expense => (
                  <div key={expense.id} className="flex items-center p-4 border-b border-gray-700">
                    {getCategoryIcon(expense.category)}
                    
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{expense.name}</div>
                      <div className="text-sm text-gray-400">{expense.category}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{expense.amount.toFixed(2)}</div>
                      {expense.originalCurrency !== expense.currency && (
                        <div className="text-xs text-gray-400">
                          {expense.originalCurrency} {expense.originalAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="ml-4 text-red-400"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Add Expense Button */}
          <div className="p-4 flex justify-center">
            <button 
              className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
              onClick={() => setCurrentView('newExpense')}
            >
              <Plus size={24} />
            </button>
          </div>
          
          {/* Bottom Navigation */}
          <div className="flex justify-around p-2 border-t border-gray-800">
            <button className="p-2 text-red-500">
              <Trash2 size={20} />
            </button>
            <button className="p-2">
              <Calendar size={20} />
            </button>
            <button className="p-2">
              <Search size={20} />
            </button>
            <button className="p-2">
              <Map size={20} />
            </button>
            <button className="p-2">
              <Settings size={20} />
            </button>
          </div>
        </div>
      )}
      
      {/* New Expense View */}
      {currentView === 'newExpense' && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-800">
            <button 
              className="p-2"
              onClick={() => setCurrentView('tripDetail')}
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold flex-1 text-center">New Entry</h1>
            <button 
              className="p-2 text-red-500"
              onClick={handleAddExpense}
            >
              Save
            </button>
          </div>
          
          {/* Amount Input */}
          <div className="bg-gray-800 p-6 flex justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mr-4">
              <span className="text-2xl">🏃</span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="bg-transparent text-4xl w-40 text-right font-bold focus:outline-none"
                placeholder="0.00"
              />
              <div className="ml-2">
                <div className="text-lg font-bold">{newExpense.currency}</div>
                <div className="text-xs text-gray-400">NZ$ = {newExpense.currency} 4.20</div>
              </div>
            </div>
          </div>
          
          {/* Expense Details Form */}
          <div className="flex-1 p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newExpense.name}
                onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="What did you spend on?"
              />
            </div>
            
            <div className="mb-4 flex items-center">
              <div className="w-6 h-6 mr-2">
                <Calendar size={24} />
              </div>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <div className="ml-2 px-3 py-2 bg-gray-700 rounded text-sm">
                Spread across days
              </div>
            </div>
            
            <div className="mb-4 flex items-center">
              <div className="w-6 h-6 mr-2">
                💰
              </div>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="Activities">Activities</option>
                <option value="Workspace">Workspace</option>
                <option value="Transportation">Transportation</option>
                <option value="Groceries">Groceries</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Accommodation">Accommodation</option>
              </select>
            </div>
            
            <div className="mb-4 flex items-center">
              <div className="w-6 h-6 mr-2">
                🏝️
              </div>
              <select
                value={newExpense.currency}
                onChange={(e) => setNewExpense({...newExpense, currency: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="DKK">Danish Krone (DKK)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GTQ">Guatemalan Quetzal (GTQ)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <button className="w-full p-3 bg-gray-800 rounded text-left focus:outline-none">
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2">
                    📷
                  </div>
                  <span>Add Photo</span>
                </div>
              </button>
            </div>
            
            <div className="mb-4">
              <button className="w-full p-3 bg-gray-800 rounded text-left flex items-center justify-between focus:outline-none">
                <span>Advanced Options</span>
                <span>▼</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <button className="w-full p-3 text-center text-red-500 font-medium">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
