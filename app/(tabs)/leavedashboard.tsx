import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Plus } from 'lucide-react-native';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

type Holiday = {
  id: string;
  name: string;
  date: string;
  isSunday: boolean;
};

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [markedDates, setMarkedDates] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0]); // Track the current month

  // Initial holidays data (West Bengal holidays for 2025-2026)
  const initialHolidays: Holiday[] = [
    { id: '1', name: 'Bengali New Year', date: '2025-04-15', isSunday: false },
    { id: '2', name: 'Good Friday', date: '2025-04-18', isSunday: false },
    { id: '3', name: 'May Day', date: '2025-05-01', isSunday: false },
    { id: '4', name: 'Independence Day / Janmashtami', date: '2025-08-15', isSunday: false },
    { id: '5', name: 'Maha Shasthi (Durgapuja)', date: '2025-09-28', isSunday: false },
    { id: '6', name: 'Maha Saptami (Durgapuja)', date: '2025-09-29', isSunday: false },
    { id: '7', name: 'Maha Ashtami (Durgapuja)', date: '2025-09-30', isSunday: false },
    { id: '8', name: 'Maha Navami (Durgapuja)', date: '2025-10-01', isSunday: false },
    { id: '9', name: 'Vijaya Dashami / Gandhi Jayanti', date: '2025-10-02', isSunday: false },
    { id: '10', name: 'Diwali / Kali Puja', date: '2025-10-20', isSunday: false },
    { id: '11', name: 'Bhatri Ditiya', date: '2025-10-23', isSunday: false },
    { id: '12', name: 'Christmas', date: '2025-12-25', isSunday: false },
    { id: '13', name: 'New Year Day', date: '2026-01-01', isSunday: false },
    { id: '14', name: 'Republic Day', date: '2026-01-26', isSunday: false },
    { id: '15', name: 'Dol Yatra', date: '2026-03-03', isSunday: false },
  ];

  useEffect(() => {
    const allHolidays = initialHolidays.filter(h => !h.isSunday);
    const sundays = getSundaysBetween(new Date(2025, 0, 1), new Date(2026, 11, 31));
    const marked: any = {};
    
    // Mark holidays in light red
    allHolidays.forEach(holiday => {
      marked[holiday.date] = {
        selected: true,
        selectedColor: '#FF6B6B',
        customStyles: {
          container: { borderRadius: 5 },
          text: { color: 'white', fontWeight: 'bold' }
        }
      };
    });
    
    // Mark Sundays in light blue
    sundays.forEach(sunday => {
      const dateStr = formatDate(sunday);
      marked[dateStr] = {
        selected: true,
        selectedColor: '#64B5F6',
        customStyles: {
          container: { borderRadius: 5 },
          text: { color: 'white', fontWeight: 'bold' }
        }
      };
    });

    setHolidays(allHolidays);
    setMarkedDates(marked);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getSundaysBetween = (startDate: Date, endDate: Date): Date[] => {
    const sundays: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (currentDate.getDay() === 1) {
        sundays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return sundays;
  };

  const handleAddHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      const date = new Date(newHoliday.date);
      const isSunday = date.getDay() === 0;
      
      if (isSunday) {
        const updatedMarkedDates: { [key: string]: any } = { ...markedDates };
        updatedMarkedDates[newHoliday.date] = {
          selected: true,
          selectedColor: '#64B5F6',
          customStyles: {
            container: { borderRadius: 5 },
            text: { color: 'white', fontWeight: 'bold' }
          }
        };
        setMarkedDates(updatedMarkedDates);
      } else {
        const newHolidayObj: Holiday = {
          id: Date.now().toString(),
          name: newHoliday.name,
          date: newHoliday.date,
          isSunday: false
        };
        
        setHolidays(prev => [...prev, newHolidayObj]);
        
        const updatedMarkedDates: { [key: string]: any } = { ...markedDates };
        updatedMarkedDates[newHoliday.date] = {
          selected: true,
          selectedColor: '#FF6B6B',
          customStyles: {
            container: { borderRadius: 5 },
            text: { color: 'white', fontWeight: 'bold' }
          }
        };
        setMarkedDates(updatedMarkedDates);
      }
      
      setNewHoliday({ name: '', date: '' });
      setIsModalVisible(false);
    }
  };

  const renderHolidayItem = ({ item }: { item: Holiday }) => (
    <View style={styles.holidayCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateDay}>{new Date(item.date).getDate()}</Text>
        <Text style={styles.dateMonth}>
          {new Date(item.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
        </Text>
      </View>
      <View style={styles.holidayInfo}>
        <Text style={styles.holidayName}>{item.name}</Text>
        <Text style={styles.holidayYear}>{new Date(item.date).getFullYear()}</Text>
      </View>
      <View style={styles.holidayIndicator} />
    </View>
  );

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to handle month change
  const handleMonthChange = (month: { dateString: string }) => {
    setCurrentMonth(month.dateString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'}
        theme={{
          calendarBackground: '#ffffff',
          todayTextColor: '#2d4150',
          dayTextColor: '#2d4150',
          monthTextColor: '#2d4150',
          textDisabledColor: '#d9d9d9',
          selectedDayBackgroundColor: '#FF6B6B',
          selectedDayTextColor: '#ffffff',
        }}
        onMonthChange={handleMonthChange} // Add this prop to handle swipe left/right
      />

      <FlatList
        data={holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
        renderItem={renderHolidayItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Holiday</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Holiday Name"
            value={newHoliday.name}
            onChangeText={text => setNewHoliday({...newHoliday, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newHoliday.date}
            onChangeText={text => setNewHoliday({...newHoliday, date: text})}
            keyboardType="numbers-and-punctuation"
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.addButtonModal]}
              onPress={handleAddHoliday}
            >
              <Text style={styles.buttonText}>Add Holiday</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  holidayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 1,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 60,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3d5a80',
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: '#98a6bd',
    marginTop: 2,
  },
  holidayInfo: {
    flex: 1,
  },
  holidayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 4,
  },
  holidayYear: {
    fontSize: 14,
    color: '#98a6bd',
  },
  holidayIndicator: {
    width: 6,
    height: 40,
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
    marginLeft: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2d4150',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  addButtonModal: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HolidayCalendar;