// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';

// interface GymSchedule {
//   day: string;
//   startTime: string;
//   endTime: string;
//   status: string;
// }

// const Admin = () => {
//   const [gymSchedule, setGymSchedule] = useState<GymSchedule[]>([]);
//   const [selectedDay, setSelectedDay] = useState<string>('');
//   const [selectedStatus, setSelectedStatus] = useState<string>('');
//   const [formData, setFormData] = useState<{ startTime: string; endTime: string; status: string }>({
//     startTime: '',
//     endTime: '',
//     status: '',
//   });
//   const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

//   // Fetch schedule on component mount
//   useEffect(() => {
//     fetchSchedule();
//   }, []);

//   // Fetch gym schedule from backend
//   const fetchSchedule = async () => {
//     try {
//       const response = await axios.get('http://192.168.0.115:5000/api/gym-schedule');
//       setGymSchedule(response.data);
//     } catch (error) {
//       console.error('Error fetching schedule:', error);
//       alert('Failed to fetch schedule. Please check the server.');
//     }
//   };

//   // Update schedule for a specific day
//   const handleUpdate = async () => {
//     if (!selectedDay) {
//       alert('Please select a day to update.');
//       return;
//     }
//     try {
//       await axios.put(`http://192.168.0.115:5000/api/gym-schedule/${selectedDay}`, formData);
//       alert('Schedule updated successfully!');
//       fetchSchedule(); // Refresh schedule
//     } catch (error) {
//       console.error('Error updating schedule:', error);
//       alert('Failed to update schedule. Please try again.');
//     }
//   };

//   // Handle input changes
//   const handleChange = (text: string, field: string) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: text,
//     }));
//   };

//   // Open modal for day selection
//   const openDaySelection = () => {
//     setIsModalVisible(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Admin Panel - Gym Schedule</Text>

//       <View style={styles.table}>
//         <Text style={styles.tableHeader}>Day</Text>
//         <Text style={styles.tableHeader}>Start Time</Text>
//         <Text style={styles.tableHeader}>End Time</Text>
//         <Text style={styles.tableHeader}>Status</Text>

//         {gymSchedule.map((day) => (
//           <View key={day.day} style={styles.tableRow}>
//             <Text>{day.day}</Text>
//             <Text>{day.startTime}</Text>
//             <Text>{day.endTime}</Text>
//             <Text>{day.status}</Text>
//           </View>
//         ))}
//       </View>

//       <Text style={styles.subTitle}>Update Schedule</Text>

//       <View style={styles.inputGroup}>
//         <Text>Select Day:</Text>
//         <TouchableOpacity style={styles.dropdown} onPress={openDaySelection}>
//           <Text>{selectedDay || 'Select a day'}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal for day selection */}
//       <Modal visible={isModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select a Day</Text>
//             {gymSchedule.map((day) => (
//               <TouchableOpacity
//                 key={day.day}
//                 style={styles.modalItem}
//                 onPress={() => {
//                   setSelectedDay(day.day);
//                   closeModal();
//                 }}
//               >
//                 <Text>{day.day}</Text>
//               </TouchableOpacity>
//             ))}
//             <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
//               <Text>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <View style={styles.inputGroup}>
//         <Text>Start Time:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g., 6:00 AM"
//           value={formData.startTime}
//           onChangeText={(text) => handleChange(text, 'startTime')}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text>End Time:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g., 10:00 PM"
//           value={formData.endTime}
//           onChangeText={(text) => handleChange(text, 'endTime')}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text>Status:</Text>
//         <TouchableOpacity
//           style={styles.dropdown}
//           onPress={() => setSelectedStatus(selectedStatus ? '' : 'Open')}
//         >
//           <Text>{selectedStatus || 'Select status'}</Text>
//         </TouchableOpacity>
//       </View>

//       <Button title="Update Schedule" onPress={handleUpdate} color="#007BFF" />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   table: {
//     marginBottom: 20,
//   },
//   tableHeader: {
//     fontWeight: 'bold',
//     marginVertical: 5,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   subTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   dropdown: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: 'gray',
//   },
//   closeButton: {
//     marginTop: 10,
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//   },
// });

// export default Admin;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import styling from '@/assets/Styles/styling';
import MyButton from '@/components/Buttons/MyButton';

interface GymSchedule {
  day: string;
  startTime: string;
  endTime: string;
  status: string;
}

const Admin = () => {
  const [gymSchedule, setGymSchedule] = useState<GymSchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [formData, setFormData] = useState<{ startTime: string; endTime: string; status: string }>({
    startTime: '',
    endTime: '',
    status: '',
  });
  const [isDayModalVisible, setIsDayModalVisible] = useState(false); // Day selection modal visibility state
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false); // Status selection modal visibility state

  // Fetch schedule on component mount
  useEffect(() => {
    fetchSchedule();
  }, []);

  // Fetch gym schedule from backend
  const fetchSchedule = async () => {
    try {
      const response = await axios.get('http://192.168.0.115:5000/api/gym-schedule');
      setGymSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      alert('Failed to fetch schedule. Please check the server.');
    }
  };

  // Update schedule for a specific day
  // Update schedule for a specific day
const handleUpdate = async () => {
    if (!selectedDay) {
      alert('Please select a day to update.');
      return;
    }
  
    if (!selectedStatus) {
      alert('Please select a status (Open or Closed).');
      return;
    }
  
    try {
      // Prepare the data to be updated, including the selected status
      const updatedData = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: selectedStatus,
      };
  
      // Send the PUT request to update the specific day's schedule
      await axios.put(`http://192.168.0.115:5000/api/gym-schedule/${selectedDay}`, updatedData);
  
      alert('Schedule updated successfully!');
      fetchSchedule(); // Refresh schedule
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Failed to update schedule. Please try again.');
    }
  };
  

  // Handle input changes
  const handleChange = (text: string, field: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: text,
    }));
  };

  // Open modal for day selection
  const openDaySelection = () => {
    setIsDayModalVisible(true);
  };

  // Close day modal
  const closeDayModal = () => {
    setIsDayModalVisible(false);
  };

  // Open modal for status selection
  const openStatusSelection = () => {
    setIsStatusModalVisible(true);
  };

  // Close status modal
  const closeStatusModal = () => {
    setIsStatusModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Panel - Gym Schedule</Text>

      <View style={styles.table}>
        

        {gymSchedule.map((day) => (
          <View key={day.day} style={styles.tableRow}>
            <Text>{day.day}</Text>
            <Text>{day.startTime}</Text>
            <Text>{day.endTime}</Text>
            <Text>{day.status}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subTitle}>Update Schedule</Text>

      <View style={styles.inputGroup}>
        <Text>Select Day:</Text>
        <TouchableOpacity style={styles.dropdown} onPress={openDaySelection}>
          <Text>{selectedDay || 'Select a day'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day selection modal */}
      <Modal visible={isDayModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Day</Text>
            {gymSchedule.map((day) => (
              <TouchableOpacity
                key={day.day}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedDay(day.day);
                  closeDayModal();
                }}
              >
                <Text>{day.day}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={closeDayModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.inputGroup}>
        <Text>Start Time:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 6:00 AM"
          value={formData.startTime}
          onChangeText={(text) => handleChange(text, 'startTime')}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>End Time:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 10:00 PM"
          value={formData.endTime}
          onChangeText={(text) => handleChange(text, 'endTime')}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>Status:</Text>
        <TouchableOpacity style={styles.dropdown} onPress={openStatusSelection}>
          <Text>{selectedStatus || 'Select status'}</Text>
        </TouchableOpacity>
      </View>

      {/* Status selection modal */}
      <Modal visible={isStatusModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Status</Text>
            {['The gym is Opened', 'The gym is Closed'].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedStatus(status);
                  closeStatusModal();
                }}
              >
                <Text>{status}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={closeStatusModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MyButton title="Update Schedule" onPress={handleUpdate} style1={styling.FullWidthbutton} style2={styling.FullwidthbtnText} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
});

export default Admin;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';

// interface GymSchedule {
//   day: string;
//   startTime: string;
//   endTime: string;
//   status: string;
// }

// const Admin = () => {
//   const [gymSchedule, setGymSchedule] = useState<GymSchedule[]>([]);
//   const [selectedDay, setSelectedDay] = useState<string>('');
//   const [selectedStatus, setSelectedStatus] = useState<string>('');
//   const [formData, setFormData] = useState<{ startTime: string; endTime: string; status: string }>({
//     startTime: '',
//     endTime: '',
//     status: '',
//   });
//   const [isDayModalVisible, setIsDayModalVisible] = useState(false);
//   const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

//   useEffect(() => {
//     fetchSchedule();
//   }, []);

//   const fetchSchedule = async () => {
//     try {
//       const response = await axios.get('http://192.168.0.115:5000/api/gym-schedule');
//       setGymSchedule(response.data);
//     } catch (error) {
//       console.error('Error fetching schedule:', error);
//       alert('Failed to fetch schedule. Please check the server.');
//     }
//   };

//   const handleUpdate = async () => {
//     if (!selectedDay) {
//       alert('Please select a day to update.');
//       return;
//     }

//     if (!selectedStatus) {
//       alert('Please select a status (Open or Closed).');
//       return;
//     }

//     // Validate time format (e.g., 6:00 AM or 6:00 PM)
//     const timeFormat = /^([1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
//     if (!timeFormat.test(formData.startTime)) {
//       alert('Start Time must be in the format: HH:MM AM/PM (e.g., 6:00 AM)');
//       return;
//     }
//     if (!timeFormat.test(formData.endTime)) {
//       alert('End Time must be in the format: HH:MM AM/PM (e.g., 10:00 PM)');
//       return;
//     }

//     try {
//       const updatedData = {
//         startTime: formData.startTime,
//         endTime: formData.endTime,
//         status: selectedStatus,
//       };

//       await axios.put(`http://192.168.0.115:5000/api/gym-schedule/${selectedDay}`, updatedData);

//       alert('Schedule updated successfully!');
//       fetchSchedule(); // Refresh schedule
//     } catch (error) {
//       console.error('Error updating schedule:', error);
//       alert('Failed to update schedule. Please try again.');
//     }
//   };

//   const handleChange = (text: string, field: string) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: text,
//     }));
//   };

//   const openDaySelection = () => {
//     setIsDayModalVisible(true);
//   };

//   const closeDayModal = () => {
//     setIsDayModalVisible(false);
//   };

//   const openStatusSelection = () => {
//     setIsStatusModalVisible(true);
//   };

//   const closeStatusModal = () => {
//     setIsStatusModalVisible(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Admin Panel - Gym Schedule</Text>

//       <View style={styles.table}>
//         {gymSchedule.map((day) => (
//           <View key={day.day} style={styles.tableRow}>
//             <Text>{day.day}</Text>
//             <Text>{day.startTime}</Text>
//             <Text>{day.endTime}</Text>
//             <Text>{day.status}</Text>
//           </View>
//         ))}
//       </View>

//       <Text style={styles.subTitle}>Update Schedule</Text>

//       <View style={styles.inputGroup}>
//         <Text>Select Day:</Text>
//         <TouchableOpacity style={styles.dropdown} onPress={openDaySelection}>
//           <Text>{selectedDay || 'Select a day'}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Day selection modal */}
//       <Modal visible={isDayModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select a Day</Text>
//             {gymSchedule.map((day) => (
//               <TouchableOpacity
//                 key={day.day}
//                 style={styles.modalItem}
//                 onPress={() => {
//                   setSelectedDay(day.day);
//                   closeDayModal();
//                 }}
//               >
//                 <Text>{day.day}</Text>
//               </TouchableOpacity>
//             ))}
//             <TouchableOpacity style={styles.closeButton} onPress={closeDayModal}>
//               <Text>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <View style={styles.inputGroup}>
//         <Text>Start Time:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g., 6:00 AM"
//           value={formData.startTime}
//           onChangeText={(text) => handleChange(text, 'startTime')}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text>End Time:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="e.g., 10:00 PM"
//           value={formData.endTime}
//           onChangeText={(text) => handleChange(text, 'endTime')}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text>Status:</Text>
//         <TouchableOpacity style={styles.dropdown} onPress={openStatusSelection}>
//           <Text>{selectedStatus || 'Select status'}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Status selection modal */}
//       <Modal visible={isStatusModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Status</Text>
//             {['The gym is Opened', 'The gym is Closed'].map((status) => (
//               <TouchableOpacity
//                 key={status}
//                 style={styles.modalItem}
//                 onPress={() => {
//                   setSelectedStatus(status);
//                   closeStatusModal();
//                 }}
//               >
//                 <Text>{status}</Text>
//               </TouchableOpacity>
//             ))}
//             <TouchableOpacity style={styles.closeButton} onPress={closeStatusModal}>
//               <Text>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Button title="Update Schedule" onPress={handleUpdate} color="#007BFF" />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   table: {
//     marginBottom: 20,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   subTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   inputGroup: {
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   dropdown: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: 'gray',
//   },
//   closeButton: {
//     marginTop: 10,
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//   },
// });
// export default Admin;
